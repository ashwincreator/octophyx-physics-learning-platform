import { eq, like, or, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, physicsTopics, generatedContent, InsertGeneratedContent, PhysicsTopic, GeneratedContent, physicsProblems, InsertPhysicsProblem, PhysicsProblem, problemSolutions, InsertProblemSolution, ProblemSolution } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Physics Topics queries
export async function searchPhysicsTopics(query: string): Promise<PhysicsTopic[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchPattern = `%${query}%`;
  const results = await db
    .select()
    .from(physicsTopics)
    .where(
      or(
        like(physicsTopics.name, searchPattern),
        like(physicsTopics.keywords, searchPattern)
      )
    )
    .limit(10);
  
  return results;
}

export async function getTopicsByCategory(category: string): Promise<PhysicsTopic[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(physicsTopics)
    .where(eq(physicsTopics.category, category as any));
  
  return results;
}

export async function getAllTopics(): Promise<PhysicsTopic[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db.select().from(physicsTopics);
  return results;
}

// Generated Content queries
export async function createGeneratedContent(content: InsertGeneratedContent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(generatedContent).values(content);
  return result[0].insertId;
}

export async function getGeneratedContentById(id: number): Promise<GeneratedContent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const results = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.id, id))
    .limit(1);
  
  return results[0];
}

export async function updateGeneratedContent(id: number, updates: Partial<GeneratedContent>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(generatedContent)
    .set(updates)
    .where(eq(generatedContent.id, id));
}

export async function getUserGeneratedContent(userId: number): Promise<GeneratedContent[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.userId, userId))
    .orderBy(desc(generatedContent.createdAt))
    .limit(50);
  
  return results;
}


// Physics Problems queries
export async function createPhysicsProblem(problem: InsertPhysicsProblem): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(physicsProblems).values(problem);
  return result[0].insertId;
}

export async function getPhysicsProblemById(id: number): Promise<PhysicsProblem | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const results = await db
    .select()
    .from(physicsProblems)
    .where(eq(physicsProblems.id, id))
    .limit(1);
  
  return results[0];
}

export async function getUserPhysicsProblems(userId: number): Promise<PhysicsProblem[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(physicsProblems)
    .where(eq(physicsProblems.userId, userId))
    .orderBy(desc(physicsProblems.createdAt))
    .limit(100);
  
  return results;
}

export async function updatePhysicsProblem(id: number, updates: Partial<PhysicsProblem>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(physicsProblems)
    .set(updates)
    .where(eq(physicsProblems.id, id));
}

// Problem Solutions queries
export async function createProblemSolution(solution: InsertProblemSolution): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(problemSolutions).values(solution);
  return result[0].insertId;
}

export async function getProblemSolutionByProblemId(problemId: number): Promise<ProblemSolution | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const results = await db
    .select()
    .from(problemSolutions)
    .where(eq(problemSolutions.problemId, problemId))
    .limit(1);
  
  return results[0];
}

export async function updateProblemSolution(id: number, updates: Partial<ProblemSolution>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(problemSolutions)
    .set(updates)
    .where(eq(problemSolutions.id, id));
}
