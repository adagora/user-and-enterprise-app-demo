class EnterprisesService {
  constructor(database) {
    this.db = database;
  }

  async getEnterpriseUsers(taxId) {
    try {
      // Query the database to retrieve users associated with the enterprise identified by taxId
      const query = `
      SELECT users.*
      FROM users
      JOIN user_enterprise_relations ON users.id = user_enterprise_relations.user_id
      JOIN enterprises ON user_enterprise_relations.enterprise_id = enterprises.id
      WHERE enterprises.tax_id = $1;
      `;
      const values = [taxId];
      const result = await this.db.query(query, values);

      // Extract user data from query result
      const users = result.rows;

      return users;
    } catch (error) {
      console.error("Error retrieving enterprise users:", error);
      throw new Error("Error retrieving enterprise users");
    }
  }

  async addUsers(userHashes, taxId, permissions) {
    try {
      // Validate parameters
      if (
        !userHashes ||
        !Array.isArray(userHashes) ||
        userHashes.length === 0
      ) {
        return { error: "Invalid user hashes" };
      }
      if (!taxId || typeof taxId !== "string") {
        return { error: "Invalid tax ID" };
      }
      if (
        !permissions ||
        !Array.isArray(permissions) ||
        permissions.length === 0
      ) {
        return { error: "Invalid permissions" };
      }

      // check permissions
      // take it from .env
      const availablePermissions = ["perm1", "perm2"];
      if (
        !permissions.every((permission) =>
          availablePermissions.includes(permission)
        )
      ) {
        return { error: "Invalid permissions" };
      }

      const client = await this.db.connect();
      await client.query("BEGIN");

      try {
        // Insert enterprise if not exists
        const enterpriseQuery =
          "INSERT INTO enterprises (tax_id) VALUES ($1) ON CONFLICT (tax_id) DO NOTHING RETURNING id";
        const enterpriseResult = await client.query(enterpriseQuery, [taxId]);

        let enterpriseId = enterpriseResult.rows[0]?.id;

        // If the enterprise already exists, retrieve its ID
        if (!enterpriseId) {
          const getEnterpriseIdQuery =
            "SELECT id FROM enterprises WHERE tax_id = $1";
          const getEnterpriseIdResult = await client.query(
            getEnterpriseIdQuery,
            [taxId]
          );
          console.log(
            "### getEnterpriseIdResult",
            getEnterpriseIdResult.rows[0]
          );
          enterpriseId = getEnterpriseIdResult.rows[0]?.id;
        }

        // Insert users
        for (const userHash of userHashes) {
          const insertUserQuery =
            "INSERT INTO users (email) VALUES ($1) RETURNING id";
          const insertUserResult = await client.query(insertUserQuery, [
            userHash,
          ]);
          const userId = insertUserResult.rows[0].id;

          // Establish relationship between user and enterprise
          const insertRelationQuery =
            "INSERT INTO user_enterprise_relations (user_id, enterprise_id) VALUES ($1, $2)";
          await client.query(insertRelationQuery, [userId, enterpriseId]);
        }

        await client.query("COMMIT");
        client.release();

        return { success: true };
      } catch (error) {
        // Rollback transaction in case of error
        await client.query("ROLLBACK");
        client.release();
        throw error;
      }
    } catch (error) {
      console.error("Error adding users:", error);
      return { error: "An error occurred while adding users" };
    }
  }
}

module.exports = EnterprisesService;
