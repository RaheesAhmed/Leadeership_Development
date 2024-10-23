import { protect } from "../../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../../lib/supabaseClient";

jest.mock("jsonwebtoken");
jest.mock("../../lib/supabaseClient");

describe("Auth Middleware", () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should call next() if a valid token is provided", async () => {
    const mockUser = {
      id: "123",
      name: "Test User",
      email: "test@example.com",
    };
    mockRequest.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ id: "123" });
    supabaseClient
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({ data: mockUser, error: null });

    await protect(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", async () => {
    await protect(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Not authorized, no token",
    });
  });

  it("should return 401 if an invalid token is provided", async () => {
    mockRequest.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await protect(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Not authorized" });
  });

  it("should return 401 if user is not found in the database", async () => {
    mockRequest.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ id: "123" });
    supabaseClient
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: null,
        error: new Error("User not found"),
      });

    await protect(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Not authorized" });
  });
});
