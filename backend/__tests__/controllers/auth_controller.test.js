import {
  handleRegister,
  handleLogin,
  handleUpdateProfile,
  handleLogout,
  handleRequestPasswordReset,
  handleConfirmPasswordReset,
} from "../../controller/auth_controller";
import * as authService from "../../services/auth_service";

// Mock the auth service
jest.mock("../../services/auth_service");

describe("Auth Controller", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = { body: {}, user: { id: "123" } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("handleRegister", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
      };
      authService.registerUser.mockResolvedValue({
        user: mockUser,
        token: "mockToken",
      });
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "user",
        department: "IT",
      };

      await handleRegister(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: "mockToken",
      });
    });

    it("should handle registration errors", async () => {
      authService.registerUser.mockRejectedValue(
        new Error("Registration failed")
      );
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "user",
        department: "IT",
      };

      await handleRegister(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Registration failed",
      });
    });
  });

  describe("handleLogin", () => {
    it("should log in a user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      authService.loginUser.mockResolvedValue({
        user: mockUser,
        token: "mockToken",
      });
      mockRequest.body = { email: "test@example.com", password: "password123" };

      await handleLogin(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: "mockToken",
      });
    });

    it("should handle login errors", async () => {
      authService.loginUser.mockRejectedValue(new Error("Invalid credentials"));
      mockRequest.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      await handleLogin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });
  });

  describe("handleUpdateProfile", () => {
    it("should update user profile successfully", async () => {
      const updatedUser = {
        id: "123",
        name: "Updated Name",
        role: "admin",
        department: "HR",
      };
      authService.updateUserProfile.mockResolvedValue(updatedUser);
      mockRequest.body = {
        name: "Updated Name",
        role: "admin",
        department: "HR",
      };

      await handleUpdateProfile(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    });

    it("should handle update errors", async () => {
      authService.updateUserProfile.mockRejectedValue(
        new Error("Update failed")
      );
      mockRequest.body = { name: "Updated Name" };

      await handleUpdateProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Update failed",
      });
    });
  });

  describe("handleLogout", () => {
    it("should log out a user successfully", async () => {
      authService.logoutUser.mockResolvedValue({
        message: "User logged out successfully",
      });

      await handleLogout(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User logged out successfully",
      });
    });

    it("should handle logout errors", async () => {
      authService.logoutUser.mockRejectedValue(new Error("Logout failed"));

      await handleLogout(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Logout failed",
      });
    });
  });

  describe("handleRequestPasswordReset", () => {
    it("should request password reset successfully", async () => {
      authService.requestPasswordReset.mockResolvedValue({
        message: "Password reset email sent",
      });
      mockRequest.body = { email: "test@example.com" };

      await handleRequestPasswordReset(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Password reset email sent",
      });
    });

    it("should handle password reset request errors", async () => {
      authService.requestPasswordReset.mockRejectedValue(
        new Error("User not found")
      );
      mockRequest.body = { email: "nonexistent@example.com" };

      await handleRequestPasswordReset(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });
  });

  describe("handleConfirmPasswordReset", () => {
    it("should confirm password reset successfully", async () => {
      authService.confirmPasswordReset.mockResolvedValue({
        message: "Password reset successful",
      });
      mockRequest.body = { token: "validtoken", newPassword: "newpassword123" };

      await handleConfirmPasswordReset(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Password reset successful",
      });
    });

    it("should handle password reset confirmation errors", async () => {
      authService.confirmPasswordReset.mockRejectedValue(
        new Error("Invalid or expired token")
      );
      mockRequest.body = {
        token: "invalidtoken",
        newPassword: "newpassword123",
      };

      await handleConfirmPasswordReset(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid or expired token",
      });
    });
  });
});
