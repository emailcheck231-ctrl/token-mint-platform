import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveWalletData, getWalletByUser, saveTokenReflection, getTokensByWallet } from "./db";
import { InsertCryptoWallet, InsertTokenReflection } from "../drizzle/schema";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Crypto wallet and token management
  crypto: router({
    /**
     * Import crypto wallet data (seed phrase, private key, etc)
     */
    importWallet: protectedProcedure
      .input(
        z.object({
          publicKey: z.string().min(1, "Public key required"),
          chain: z.string().default("ethereum"),
          importMethod: z.enum(["seedPhrase", "privateKey", "publicKey"]),
          metadata: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.openId) {
          throw new Error("User openId required");
        }

        try {
          const wallet = await saveWalletData(ctx.user.openId, {
            publicKey: input.publicKey,
            chain: input.chain,
            importMethod: input.importMethod,
            isConnected: 1,
            metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          });

          return {
            success: !!wallet,
            wallet,
          };
        } catch (error) {
          console.error("Failed to import wallet:", error);
          throw new Error("Failed to import wallet");
        }
      }),

    /**
     * Get user's connected wallet
     */
    getWallet: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.openId) {
        throw new Error("User openId required");
      }

      const wallet = await getWalletByUser(ctx.user.openId);
      return wallet;
    }),

    /**
     * Reflect token to wallet
     */
    reflectToken: protectedProcedure
      .input(
        z.object({
          walletId: z.number().int().positive(),
          contractAddress: z.string().min(1),
          symbol: z.string().min(1),
          name: z.string().min(1),
          decimals: z.number().int().default(18),
          totalSupply: z.string().optional(),
          metadata: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const token = await saveTokenReflection(input.walletId, {
            contractAddress: input.contractAddress,
            symbol: input.symbol,
            name: input.name,
            decimals: input.decimals,
            totalSupply: input.totalSupply || null,
            isReflected: 1,
            metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          });

          return {
            success: !!token,
            token,
          };
        } catch (error) {
          console.error("Failed to reflect token:", error);
          throw new Error("Failed to reflect token");
        }
      }),

    /**
     * Get tokens for a wallet
     */
    getTokens: protectedProcedure
      .input(z.object({ walletId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const tokens = await getTokensByWallet(input.walletId);
        return tokens;
      }),

    /**
     * Mint token to wallet
     */
    mintToken: protectedProcedure
      .input(
        z.object({
          walletId: z.number().int().positive(),
          tokenContractAddress: z.string().min(1),
          amount: z.string().min(1),
          chainId: z.number().default(11155111), // Sepolia by default
        })
      )
      .mutation(async ({ input }) => {
        try {
          // In production, this would call actual blockchain mint
          console.log("Minting token:", input);
          return {
            success: true,
            transactionHash: `0x${Math.random().toString(16).slice(2)}`,
          };
        } catch (error) {
          console.error("Failed to mint token:", error);
          throw new Error("Failed to mint token");
        }
      }),

    /**
     * Transfer token between wallets
     */
    transferToken: protectedProcedure
      .input(
        z.object({
          fromWalletId: z.number().int().positive(),
          toAddress: z.string().min(1),
          tokenContractAddress: z.string().min(1),
          amount: z.string().min(1),
          chainId: z.number().default(11155111), // Sepolia by default
        })
      )
      .mutation(async ({ input }) => {
        try {
          // In production, this would call actual blockchain transfer
          console.log("Transferring token:", input);
          return {
            success: true,
            transactionHash: `0x${Math.random().toString(16).slice(2)}`,
          };
        } catch (error) {
          console.error("Failed to transfer token:", error);
          throw new Error("Failed to transfer token");
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
