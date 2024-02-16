const EnterprisesService = require("./enterprisesService");

const mockDatabase = {
  connect: jest.fn(),
};

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockSuccessfulResult = {
  rows: [{ id: 1 }],
};

const mockError = new Error("Mock error");

describe("EnterprisesService", () => {
  let enterprisesService;

  beforeEach(() => {
    enterprisesService = new EnterprisesService(mockDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addUsers", () => {
    test("should return error if userHashes is missing or empty", async () => {
      const result = await enterprisesService.addUsers(null, "123456", [
        "perm1",
      ]);
      expect(result).toEqual({ error: "Invalid user hashes" });
    });

    test("should return error if taxId is missing", async () => {
      const result = await enterprisesService.addUsers(
        ["hash1", "hash2"],
        null,
        ["perm1"]
      );
      expect(result).toEqual({ error: "Invalid tax ID" });
    });

    test("should return error if permissions are missing or empty", async () => {
      const result = await enterprisesService.addUsers(
        ["hash1", "hash2"],
        "123456",
        null
      );
      expect(result).toEqual({ error: "Invalid permissions" });
    });

    test("should return error if permissions contain invalid values", async () => {
      const result = await enterprisesService.addUsers(
        ["hash1", "hash2"],
        "123456",
        ["invalid"]
      );
      expect(result).toEqual({ error: "Invalid permissions" });
    });

    test("should successfully add users", async () => {
      // Mock database connection and queries for successful execution
      mockDatabase.connect.mockResolvedValueOnce(mockClient);
      mockClient.query.mockResolvedValueOnce(mockSuccessfulResult);

      const result = await enterprisesService.addUsers(
        ["hash1", "hash2"],
        "123456",
        ["perm1"]
      );
      expect(result).toEqual({ success: true });
    });

    test("should handle database error gracefully", async () => {
      // Mock database connection and query to throw an error
      mockDatabase.connect.mockResolvedValueOnce(mockClient);
      mockClient.query.mockRejectedValueOnce(mockError);

      const result = await enterprisesService.addUsers(
        ["hash1", "hash2"],
        "123456",
        ["perm1"]
      );
      expect(result).toEqual({ error: "An error occurred while adding users" });
    });

    test("should rollback transaction in case of error during enterprise insertion", async () => {
      // Mock database connection and query for enterprise insertion to throw an error
      mockDatabase.connect.mockResolvedValueOnce(mockClient);
      mockClient.query.mockRejectedValueOnce(mockError);

      try {
        await enterprisesService.addUsers(["hash1", "hash2"], "123456", [
          "perm1",
        ]);
      } catch (error) {
        // Expected error, so we can ignore it
      }

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    test("should rollback transaction in case of error during user insertion", async () => {
      mockDatabase.connect.mockResolvedValueOnce(mockClient);
      mockClient.query.mockResolvedValueOnce(mockSuccessfulResult);
      mockClient.query.mockRejectedValueOnce(mockError);

      try {
        await enterprisesService.addUsers(["hash1", "hash2"], "123456", [
          "perm1",
        ]);
      } catch (error) {
        // Expected error, so we can ignore it
      }

      // Expectations to ensure transaction rollback
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    test("should check if userHashes value [hash1] is not duplicated", async () => {
      const result = await enterprisesService.addUsers(
        ["hash1", "hash1", "hash2"],
        "123456",
        ["perm1"]
      );
      expect(result).toEqual({ error: "Duplicate user hash: hash1" });
    });
  });
});
