import { type Prisma } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { capture } from "../../services/posthog";
import { protectedProcedure } from "../../trpc";
import { telegramInstance } from "../quests/services/telegramInstance";

export const updateDisplayName = protectedProcedure
  .input(
    z.object({
      displayName: z.string().min(5).max(50).trim().optional(),
      telegramId: z.number().optional(),
    }),
  )
  .mutation(
    async ({ ctx: { session }, input: { telegramId, displayName } }) => {
      const userId = session.userId;

      void capture({
        distinctId: userId.toString(),
        event: "update_display_name",
        properties: {
          displayName: displayName,
        },
      });

      let avatarUrl: string | null = null;

      if (telegramId) {
        avatarUrl = await telegramInstance.getUserProfilePhoto({
          telegramUserId: telegramId,
        });
      }

      const toUpdate = {
        displayName: displayName,
        telegramId: telegramId?.toString(),
        avatarUrl,
      } satisfies Prisma.UserUpdateInput;

      if (!telegramId) {
        delete toUpdate.telegramId;
      }

      if (!displayName) {
        delete toUpdate.displayName;
      }

      await db.user.update({
        where: {
          id: userId,
        },
        data: toUpdate,
      });
    },
  );
