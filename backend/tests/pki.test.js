import { encryptPayload, decryptPayload, initKeys } from "../utils/pki.js";
import fs from "fs";
import path from "path";

// We can mock fs if we want, but since initKeys already handles existence, 
// we can just run it once to ensure keys are there for the test.
// For true unit testing, we'd mock the keys.

describe("PKI Utility", () => {
  beforeAll(() => {
    // Ensure keys exist for testing
    initKeys();
  });

  test("should encrypt and decrypt a payload correctly", () => {
    const payload = { userId: "12345", role: "admin" };
    const encrypted = encryptPayload(payload);
    
    expect(typeof encrypted).toBe("string");
    expect(encrypted).not.toBe(JSON.stringify(payload));

    const decrypted = decryptPayload(encrypted);
    expect(decrypted).toEqual(payload);
  });

  test("should handle different data types in payload", () => {
    const payload = { number: 1, bool: true, str: "text", arr: [1, 2], obj: { a: 1 } };
    const encrypted = encryptPayload(payload);
    const decrypted = decryptPayload(encrypted);
    expect(decrypted).toEqual(payload);
  });
});
