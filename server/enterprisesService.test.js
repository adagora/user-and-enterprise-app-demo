const EnterprisesService = require("./enterprisesService");
const dotenv = require("dotenv");
dotenv.config();

const mockDb = {
  connect: jest.fn()
};

describe("EnterprisesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error for invalid user hashes", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers("taxId", null, [
      process.env.PERM1
    ]);
    expect(result.error).toEqual("Invalid user hashes");
  });

  it("should return error for empty array in userHashes", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      [],
      [process.env.PERM1, process.env.PERM2]
    );
    expect(result.error).toEqual("Invalid user hashes");
  });

  it("should return error for invalid taxId", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      null,
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, process.env.PERM2]
    );
    expect(result.error).toEqual("Invalid tax ID");
  });

  it("should return error for no permissions parameter", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      null
    );
    expect(result.error).toEqual("Invalid permissions");
  });

  it("should return error for 1 item in permissions array", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1]
    );
    expect(result.error).toEqual(
      "Invalid permissions, you do not have enough permission"
    );
  });

  it("should return error for more than 2 items in permissions array", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, process.env.PERM2, process.env.PERM3]
    );
    expect(result.error).toEqual(
      "Invalid permissions, you do not have enough permission"
    );
  });

  it("should return error for invalid permission values", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, "invalidPerm"]
    );
    expect(result.error).toEqual(
      "Invalid permissions, you do not have enough permission"
    );
  });

  it("should return error for duplicated user details", async () => {
    mockDb.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] })
    });

    const enterprisesService = new EnterprisesService(mockDb);
    const result1 = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, process.env.PERM2]
    );

    mockDb.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] })
    });

    const result2 = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, process.env.PERM2]
    );

    expect(result2.error).toEqual("An error occurred while adding users");
  });

  it("should return error for no inputs", async () => {
    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers();
    expect(result.error).toEqual(
      "Invalid inputs, please provide userHashes, taxId, and permissions"
    );
  });

  it("should return success for valid inputs", async () => {
    mockDb.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] })
    });

    const enterprisesService = new EnterprisesService(mockDb);
    const result = await enterprisesService.addUsers(
      "7162828483",
      ["0xHash1", "0xHash2"],
      [process.env.PERM1, process.env.PERM2]
    );

    expect(result).toEqual({ success: true, message: "Users added" });
  });
});
