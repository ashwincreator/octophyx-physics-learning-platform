import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Physics topics table - stores predefined physics concepts for autocomplete
 */
export const physicsTopics = mysqlTable("physics_topics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["mechanics", "waves", "electromagnetism", "quantum", "thermodynamics", "optics", "relativity"]).notNull(),
  description: text("description"),
  keywords: text("keywords"), // JSON array of related terms
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhysicsTopic = typeof physicsTopics.$inferSelect;
export type InsertPhysicsTopic = typeof physicsTopics.$inferInsert;

/**
 * Generated content table - stores AI-generated explanations and visualizations
 */
export const generatedContent = mysqlTable("generated_content", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  topic: varchar("topic", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  explanation: text("explanation"), // AI-generated explanation
  formulas: text("formulas"), // JSON array of formulas
  animationCode: text("animationCode"), // Manim-style code
  diagramUrl: text("diagramUrl"), // Generated diagram image URL
  videoUrl: text("videoUrl"), // Generated animation video URL
  status: mysqlEnum("status", ["pending", "generating", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = typeof generatedContent.$inferInsert;
/**
 * Structured content table - stores parsed, structured data from AI generation
 * Enables rich visualizations, tables, and interactive learning
 */
export const structuredContent = mysqlTable("structured_content", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").references(() => generatedContent.id),
  keyPoints: text("keyPoints"), // JSON array of key learning points
  formulasData: text("formulasData"), // JSON array with formula, description, usage
  examples: text("examples"), // JSON array of real-world examples
  visualData: text("visualData"), // JSON data for charts/graphs
  practiceProblems: text("practiceProblems"), // JSON array of problems with solutions
  videoUrl: text("videoUrl"), // Generated video URL
  diagramSvg: text("diagramSvg"), // SVG code for interactive diagrams
  interactiveData: text("interactiveData"), // JSON for interactive simulations
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StructuredContent = typeof structuredContent.$inferSelect;
export type InsertStructuredContent = typeof structuredContent.$inferInsert;
