import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../../db";
import { callOrGetFromCache, Key } from "../../services/upstash";
import { publicProcedure } from "../../trpc";

export class LeaderboardService {
  // singleton
  private static instance: LeaderboardService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }

    return LeaderboardService.instance;
  }

  public async getLeaderboard() {
    return callOrGetFromCache(Key.LEADERBOARD, async () => {
      const result = await db.occ.findMany({
        include: {
          _count: {
            select: {
              Share: true,
            },
          },
          Provider: {
            select: {
              User: {
                select: {
                  displayName: true,
                  avatarUrl: true,
                  Provider: {
                    where: {
                      type: "TON_WALLET",
                    },
                  },
                  id: true,
                },
              },
            },
          },
        },
      });

      const sortByShareCount = result.sort(
        (a, b) =>
          b.shareCount + b._count.Share - (a.shareCount + a._count.Share),
      );

      return {
        data: sortByShareCount,
        total: sortByShareCount.length,
      };
    });
  }

  public async getMyCurrentLeaderboardPosition({ userId }: { userId: number }) {
    const leaderboard = await this.getLeaderboard();

    const rank = leaderboard.data.findIndex(
      (occ) => occ.Provider.User.id === userId,
    );

    if (rank === -1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const item = leaderboard.data[rank]!;
    const address = item.Provider.User.Provider[0]?.value;

    if (!address) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not have a TON address",
      });
    }

    return {
      occId: item.id,
      avatarUrl: item.Provider.User.avatarUrl,
      occImageUrl: "",
      rank: rank + 1,
      shareCount: item._count.Share,
      username: item.Provider.User.displayName ?? "?",
      address,
    };
  }
}

export const getLeaderboard = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      cursor: z.number().nullish(),
    }),
  )
  .query(async ({ input: { limit, cursor } }) => {
    const { data: result, total } =
      await LeaderboardService.getInstance().getLeaderboard();

    // pagination
    const start = cursor ?? 0;
    const end = start + limit;

    return {
      data: result.slice(start, end),
      total: total,
      nextCursor: end,
    };
  });
