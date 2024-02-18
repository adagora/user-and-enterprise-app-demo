const dotenv = require("dotenv");
dotenv.config();

class EnterprisesService {
  constructor(database) {
    this.db = database;
  }

  async getEnterpriseUsers(taxId) {
    try {
      if (!taxId || typeof taxId !== "string") {
        return { error: "Invalid taxId parameter" };
      }

      const query = `
      SELECT users.*
      FROM users
      JOIN user_enterprise_relations ON users.id = user_enterprise_relations.user_id
      JOIN enterprises ON user_enterprise_relations.enterprise_id = enterprises.id
      WHERE enterprises.tax_id = $1;
      `;
      const values = [taxId];
      const result = await this.db.query(query, values);
      if (result.rows.length === 0) {
        return { error: "Tax ID not found" };
      }
      const users = result.rows;
      return users;
    } catch (error) {
      return { error: "Failed retrieving enterprise users" };
    }
  }

  async getUsersRegisteredAfterDate(date) {
    try {
      if (!date || typeof date !== "string") {
        return { error: "Invalid date parameter" };
      }

      const query = `
      SELECT *
      FROM users
      WHERE created_at > $1;
      `;
      const values = [date];
      const result = await this.db.query(query, values);
      const users = result.rows;
      return users;
    } catch (error) {
      return {
        error: "Failed retrieving users registered after the specified date"
      };
    }
  }

  async addUsers(taxId, userHashes, permissions) {
    try {
      if (!userHashes && !taxId && !permissions) {
        return {
          error:
            "Invalid inputs, please provide userHashes, taxId, and permissions"
        };
      }

      if (!taxId || typeof taxId !== "string") {
        return { error: "Invalid tax ID" };
      }

      if (
        !userHashes ||
        !Array.isArray(userHashes) ||
        userHashes.length === 0
      ) {
        return { error: "Invalid user hashes" };
      }

      if (
        !permissions ||
        !Array.isArray(permissions) ||
        permissions.length === 0
      ) {
        return { error: "Invalid permissions" };
      }

      const requiredPermissions = [process.env.PERM1, process.env.PERM2];
      if (
        permissions.length > 2 ||
        !requiredPermissions.every((permission) =>
          permissions.includes(permission)
        )
      ) {
        return {
          error: "Invalid permissions, you do not have enough permission"
        };
      }

      const client = await this.db.connect();
      await client.query("BEGIN");

      try {
        const enterpriseQuery =
          "INSERT INTO enterprises (tax_id) VALUES ($1) ON CONFLICT (tax_id) DO NOTHING RETURNING id";
        const enterpriseResult = await client.query(enterpriseQuery, [taxId]);

        let enterpriseId = enterpriseResult.rows[0]?.id;

        if (!enterpriseId) {
          const getEnterpriseIdQuery =
            "SELECT id FROM enterprises WHERE tax_id = $1";
          const getEnterpriseIdResult = await client.query(
            getEnterpriseIdQuery,
            [taxId]
          );
          enterpriseId = getEnterpriseIdResult.rows[0]?.id;
        }

        for (const userHash of userHashes) {
          const insertUserQuery =
            "INSERT INTO users (email) VALUES ($1) RETURNING id";
          const insertUserResult = await client.query(insertUserQuery, [
            userHash
          ]);
          const userId = insertUserResult.rows[0].id;

          const insertRelationQuery =
            "INSERT INTO user_enterprise_relations (user_id, enterprise_id) VALUES ($1, $2)";
          await client.query(insertRelationQuery, [userId, enterpriseId]);
        }

        await client.query("COMMIT");
        client.release();

        return { success: true };
      } catch (error) {
        await client.query("ROLLBACK");
        client.release();
        return {
          error:
            "An error occurred while adding users, duplicated users details"
        };
      }
    } catch (error) {
      return { error: "An error occurred while adding users" };
    }
  }
}

module.exports = EnterprisesService;
