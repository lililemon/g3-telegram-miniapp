import { TRPCError } from "@trpc/server";
import { Prisma } from "database";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";
import { ErrorMessage } from "./ErrorMessage";

class GetCurrentUserService {
  static readonly _defaultSelectUser = {
    id: true,
    point: true,
    displayName: true,
    avatarUrl: true,
    telegramId: true,
    Provider: {
      select: {
        id: true,
        type: true,
        value: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export const getCurrentUser = protectedProcedure.query(
  async ({ ctx: { session } }) => {
    const userId = session.userId;

    const user = await db.user
      .findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: GetCurrentUserService._defaultSelectUser,
      })
      .catch((error) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: ErrorMessage.UserNotFound,
          });
        }

        throw error;
      });

    return user;
  },
);
