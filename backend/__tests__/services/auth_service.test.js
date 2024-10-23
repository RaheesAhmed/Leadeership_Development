import {
  registerUser,
  loginUser,
  updateUserProfile,
  logoutUser,
  requestPasswordReset,
  confirmPasswordReset,
} from "../../services/auth_service";
import { supabaseClient } from "../../lib/supabaseClient";
import jwt from "jsonwebtoken";

// Mock the supabaseClient
jest.mock("../../lib/supabaseClient");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      supabaseClient
        .from()
        .insert.mockResolvedValue({ data: [mockUser], error: null });
      jwt.sign.mockReturnValue("mockToken");

      const result = await registerUser(
        "Test User",
        "test@example.com",
        "password123",
        "user",
        "IT"
      );

      expect(result).toEqual({ user: mockUser, token: "mockToken" });
    });

    it("should throw an error if registration fails", async () => {
      supabaseClient.auth.signUp.mockResolvedValue({
        data: null,
        error: new Error("Registration failed"),
      });

      await expect(
        registerUser(
          "Test User",
          "test@example.com",
          "password123",
          "user",
          "IT"
        )
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("loginUser", () => {
    it("should log in a user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      supabaseClient
        .from()
        .select()
        .single.mockResolvedValue({ data: mockUser, error: null });
      jwt.sign.mockReturnValue("mockToken");

      const result = await loginUser("test@example.com", "password123");

      expect(result).toEqual({ user: mockUser, token: "mockToken" });
    });

    it("should throw an error if login fails", async () => {
      supabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: new Error("Invalid credentials"),
      });

      await expect(
        loginUser("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile successfully", async () => {
      const updatedUser = {
        id: "123",
        name: "Updated Name",
        role: "admin",
        department: "HR",
      };
      supabaseClient
        .from()
        .update()
        .eq()
        .select()
        .single.mockResolvedValue({ data: updatedUser, error: null });

      const result = await updateUserProfile("123", {
        name: "Updated Name",
        role: "admin",
        department: "HR",
      });

      expect(result).toEqual(updatedUser);
    });

    it("should throw an error if update fails", async () => {
      supabaseClient
        .from()
        .update()
        .eq()
        .select()
        .single.mockResolvedValue({
          data: null,
          error: new Error("Update failed"),
        });

      await expect(
        updateUserProfile("123", { name: "Updated Name" })
      ).rejects.toThrow("Update failed");
    });
  });

  describe("logoutUser", () => {
    it("should log out a user successfully", async () => {
      supabaseClient.auth.signOut.mockResolvedValue({ error: null });

      const result = await logoutUser("123");

      expect(result).toEqual({ message: "User logged out successfully" });
    });

    it("should throw an error if logout fails", async () => {
      supabaseClient.auth.signOut.mockResolvedValue({
        error: new Error("Logout failed"),
      });

      await expect(logoutUser("123")).rejects.toThrow("Logout failed");
    });
  });

  describe("requestPasswordReset", () => {
    it("should request password reset successfully", async () => {
      supabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await requestPasswordReset("test@example.com");

      expect(result).toEqual({ message: "Password reset email sent" });
    });

    it("should throw an error if password reset request fails", async () => {
      supabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: new Error("User not found"),
      });

      await expect(
        requestPasswordReset("nonexistent@example.com")
      ).rejects.toThrow("User not found");
    });
  });

  describe("confirmPasswordReset", () => {
    it("should confirm password reset successfully", async () => {
      supabaseClient.auth.updateUser.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await confirmPasswordReset("validtoken", "newpassword123");

      expect(result).toEqual({ message: "Password reset successful" });
    });

    it("should throw an error if password reset confirmation fails", async () => {
      supabaseClient.auth.updateUser.mockResolvedValue({
        data: null,
        error: new Error("Invalid or expired token"),
      });

      await expect(
        confirmPasswordReset("invalidtoken", "newpassword123")
      ).rejects.toThrow("Invalid or expired token");
    });
  });
});
