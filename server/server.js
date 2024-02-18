const express = require("express");
const { dbReadPool, dbCreatePool, createTables } = require("./db");
const cors = require("cors");
const EnterprisesService = require("./enterprisesService");

const PORT = 3000;

const app = express();
app.use(express.json(), cors());

app.post("/enterprise/users/add", async (req, res) => {
  try {
    const { userHashes, taxId, permissions } = req.body;

    const enterprisesService = new EnterprisesService(dbCreatePool);
    const result = await enterprisesService.addUsers(
      taxId,
      userHashes,
      permissions
    );

    if (result.error) {
      res.status(400).json({ error: result.error });
    } else {
      res.status(200).json({ success: true, message: "Users added" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/enterprise/users", async (req, res) => {
  try {
    const { taxId } = req.query;

    const enterprisesService = new EnterprisesService(dbReadPool);
    const users = await enterprisesService.getEnterpriseUsers(taxId);

    if (users.error) {
      res.status(400).json({ error: users.error });
    } else {
      res.status(200).json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/enterprise/users/registered-after/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const enterprisesService = new EnterprisesService(dbReadPool);
    const users = await enterprisesService.getUsersRegisteredAfterDate(date);

    if (users.error) {
      res.status(400).json({ error: users.error });
    } else {
      res.status(200).json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  try {
    await createTables();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
