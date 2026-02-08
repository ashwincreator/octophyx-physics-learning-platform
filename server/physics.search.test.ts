import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("physics.searchTopics", () => {
  it("should return empty array for non-existent topic", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.searchTopics({ query: "nonexistentphysicstopic12345" });

    expect(result).toEqual([]);
  });

  it("should find topics by name", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.searchTopics({ query: "Newton" });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.name).toContain("Newton");
  });

  it("should find topics by keyword", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.searchTopics({ query: "force" });

    expect(result.length).toBeGreaterThan(0);
  });
});

describe("physics.getAllTopics", () => {
  it("should return all seeded topics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.getAllTopics();

    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeGreaterThanOrEqual(27); // We seeded 27 topics
  });
});

describe("physics.getTopicsByCategory", () => {
  it("should return topics for mechanics category", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.getTopicsByCategory({ category: "mechanics" });

    expect(result.length).toBeGreaterThan(0);
    result.forEach(topic => {
      expect(topic.category).toBe("mechanics");
    });
  });

  it("should return topics for quantum category", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.physics.getTopicsByCategory({ category: "quantum" });

    expect(result.length).toBeGreaterThan(0);
    result.forEach(topic => {
      expect(topic.category).toBe("quantum");
    });
  });
});
