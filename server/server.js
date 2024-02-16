const express = require("express");
const { dbReadPool, dbWritePool, createTables } = require("./db");
const cors = require("cors");
const EnterprisesService = require("./enterprisesService");

const PORT = 3000;

const app = express();
app.use(express.json(), cors());

app.post("/enterprise/users/add", async (req, res) => {
  try {
    const { userHashes, taxId, permissions } = req.body;
    console.log("### body", req.body);

    const enterprisesService = new EnterprisesService(dbWritePool);
    const result = await enterprisesService.addUsers(
      userHashes,
      taxId,
      permissions
    );

    // Sending response based on result
    if (result.error) {
      res.status(400).json({ error: result.error });
    } else {
      res.status(200).json({ success: true, message: "Users added" });
    }
  } catch (error) {
    console.error("Error in endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/enterprise/users", async (req, res) => {
  try {
    const { taxId } = req.query;
    console.log("### Query parameters", req.query);

    // Validate taxId parameter
    if (!taxId || typeof taxId !== "string") {
      return res.status(400).json({ error: "Invalid taxId parameter" });
    }

    const enterprisesService = new EnterprisesService(dbReadPool);
    // Retrieve users associated with the enterprise
    const users = await enterprisesService.getEnterpriseUsers(taxId);

    // Sending response with the retrieved users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in endpoint:", error);
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
