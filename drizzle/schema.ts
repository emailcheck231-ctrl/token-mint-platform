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
 * Crypto wallet table - stores imported wallet data and connection status
 */
export const cryptoWallets = mysqlTable("cryptoWallets", {
  id: int("id").autoincrement().primaryKey(),
  /** Link to user via openId */
  openId: varchar("openId", { length: 64 }).notNull(),
  /** Wallet public address or key identifier */
  publicKey: varchar("publicKey", { length: 256 }).notNull().unique(),
  /** Wallet chain (ethereum, sepolia, etc) */
  chain: varchar("chain", { length: 64 }).default("ethereum").notNull(),
  /** Import method (seedPhrase, privateKey, etc) */
  importMethod: varchar("importMethod", { length: 64 }).notNull(),
  /** Connection status */
  isConnected: int("isConnected").default(1).notNull(),
  /** Wallet metadata as JSON */
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CryptoWallet = typeof cryptoWallets.$inferSelect;
export type InsertCryptoWallet = typeof cryptoWallets.$inferInsert;

/**
 * Token reflection table - tracks tokens reflected to wallets
 */
export const tokenReflections = mysqlTable("tokenReflections", {
  id: int("id").autoincrement().primaryKey(),
  /** Link to crypto wallet */
  walletId: int("walletId").notNull(),
  /** Token contract address */
  contractAddress: varchar("contractAddress", { length: 256 }).notNull(),
  /** Token symbol (e.g., USDC, DAI) */
  symbol: varchar("symbol", { length: 64 }).notNull(),
  /** Token name */
  name: varchar("name", { length: 256 }).notNull(),
  /** Token decimals */
  decimals: int("decimals").default(18).notNull(),
  /** Total supply */
  totalSupply: text("totalSupply"),
  /** Reflection status */
  isReflected: int("isReflected").default(1).notNull(),
  /** Token metadata as JSON */
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TokenReflection = typeof tokenReflections.$inferSelect;
export type InsertTokenReflection = typeof tokenReflections.$inferInsert;
