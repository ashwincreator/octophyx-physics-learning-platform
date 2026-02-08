import { describe, expect, it } from "vitest";

describe("Google API Configuration", () => {
  it("should have Google API key configured", () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^AIzaSy/); // Google API keys start with AIzaSy
  });

  it("should have VITE Google API key configured for frontend", () => {
    const viteApiKey = process.env.VITE_GOOGLE_API_KEY;
    expect(viteApiKey).toBeDefined();
    expect(viteApiKey).toBeTruthy();
    expect(viteApiKey).toMatch(/^AIzaSy/);
  });

  it("should have matching API keys", () => {
    const serverKey = process.env.GOOGLE_API_KEY;
    const clientKey = process.env.VITE_GOOGLE_API_KEY;
    expect(serverKey).toBe(clientKey);
  });

  it("should validate API key format", () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey) {
      // Google API keys are base64-like strings starting with AIzaSy
      expect(apiKey.length).toBeGreaterThan(30);
      expect(apiKey.length).toBeLessThan(200);
    }
  });
});
