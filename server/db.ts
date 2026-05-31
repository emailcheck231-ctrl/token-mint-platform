import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cryptoWallets, InsertCryptoWallet, CryptoWallet, tokenReflections, InsertTokenReflection, TokenReflection } from "../drizzle/schema";
import { ENV } from "./_core/env";

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
      values.role = "admin";
      updateSet.role = "admin";
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

/**
 * Save wallet data for a user
 */
export async function saveWalletData(openId: string, walletInput: Omit<InsertCryptoWallet, 'openId'>): Promise<CryptoWallet | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save wallet: database not available");
    return null;
  }

  try {
    const data: InsertCryptoWallet = {
      ...walletInput,
      openId,
    } as InsertCryptoWallet;
    await db.insert(cryptoWallets).values(data);
    // Fetch the newly inserted wallet
    const saved = await db.select().from(cryptoWallets).where(eq(cryptoWallets.openId, openId)).limit(1);
    return saved.length > 0 ? saved[0] : null;
  } catch (error) {
    console.error("[Database] Failed to save wallet:", error);
    throw error;
  }
}

/**
 * Get wallet by user openId
 */
export async function getWalletByUser(openId: string): Promise<CryptoWallet | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get wallet: database not available");
    return null;
  }

  const result = await db.select().from(cryptoWallets).where(eq(cryptoWallets.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Save token reflection for a wallet
 */
export async function saveTokenReflection(walletId: number, tokenInput: Omit<InsertTokenReflection, 'walletId'>): Promise<TokenReflection | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save token reflection: database not available");
    return null;
  }

  try {
    const data: InsertTokenReflection = {
      ...tokenInput,
      walletId,
    } as InsertTokenReflection;
    await db.insert(tokenReflections).values(data);
    // Fetch the newly inserted token
    const saved = await db.select().from(tokenReflections).where(eq(tokenReflections.walletId, walletId)).limit(1);
    return saved.length > 0 ? saved[0] : null;
  } catch (error) {
    console.error("[Database] Failed to save token reflection:", error);
    throw error;
  }
}

/**
 * Get tokens by wallet
 */
export async function getTokensByWallet(walletId: number): Promise<TokenReflection[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tokens: database not available");
    return [];
  }

  const result = await db.select().from(tokenReflections).where(eq(tokenReflections.walletId, walletId));
  return result;
}

// TODO: add feature queries here as your schema grows.
