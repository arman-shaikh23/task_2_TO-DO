import { escapeRegex, buildFilters, buildSort, getPriorityWeight } from "../utils/todoHelpers.js";

describe("Todo Helpers Utility", () => {
  describe("escapeRegex", () => {
    test("should escape special regex characters", () => {
      expect(escapeRegex("(((")).toBe("\\(\\(\\(");
      expect(escapeRegex(".*+?^${}()|[Requested]")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[Requested\\]");
    });

    test("should return same string if no special characters", () => {
      expect(escapeRegex("simple text")).toBe("simple text");
    });
  });

  describe("buildFilters", () => {
    const userId = "user123";

    test("should include user ID in filters", () => {
      const filters = buildFilters(userId, {});
      expect(filters.user).toBe(userId);
    });

    test("should build regex search filters with escaped input", () => {
      const query = { search: "(((" };
      const filters = buildFilters(userId, query);
      // The escaped regex for "(((" should be "\(\(\("
      const expectedRegex = "\\(\\(\\(";
      expect(filters.$or).toContainEqual({ title: { $regex: expectedRegex, $options: "i" } });
    });

    test("should include status and priority filters", () => {
      const query = { status: "completed", priority: "High" };
      const filters = buildFilters(userId, query);
      expect(filters.status).toBe("completed");
      expect(filters.priority).toBe("High");
    });
  });

  describe("buildSort", () => {
    test("should return latest as default", () => {
      expect(buildSort()).toEqual({ createdAt: -1 });
    });

    test("should return priority sort map", () => {
      expect(buildSort("priority")).toEqual({ priorityWeight: -1, dueDate: 1 });
    });
  });

  describe("getPriorityWeight", () => {
    test("should return correct weights", () => {
      expect(getPriorityWeight("High")).toBe(3);
      expect(getPriorityWeight("Medium")).toBe(2);
      expect(getPriorityWeight("Low")).toBe(1);
      expect(getPriorityWeight("None")).toBe(0);
    });
  });
});
