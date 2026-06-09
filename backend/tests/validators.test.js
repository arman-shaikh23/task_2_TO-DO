import { isStrongPassword, sanitizePagination } from "../utils/validators.js";

describe("Validators Utility", () => {
  describe("isStrongPassword", () => {
    test("should return true for valid strong passwords", () => {
      expect(isStrongPassword("Password123")).toBe(true);
      expect(isStrongPassword("Secure!P4ss")).toBe(true);
    });

    test("should return false for passwords without uppercase", () => {
      expect(isStrongPassword("password123")).toBe(false);
    });

    test("should return false for passwords without numbers", () => {
      expect(isStrongPassword("Password")).toBe(false);
    });

    test("should return false for passwords shorter than 8 characters", () => {
      expect(isStrongPassword("P1ass")).toBe(false);
    });
  });

  describe("sanitizePagination", () => {
    test("should return default values for empty input", () => {
      const result = sanitizePagination();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(8);
      expect(result.skip).toBe(0);
    });

    test("should handle valid custom page and limit", () => {
      const result = sanitizePagination(2, 10);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(10);
    });

    test("should prevent negative page numbers", () => {
      const result = sanitizePagination(-5);
      expect(result.page).toBe(1);
    });

    test("should cap the limit at 50", () => {
      const result = sanitizePagination(1, 100);
      expect(result.limit).toBe(50);
    });
  });
});
