import { z } from "zod";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

export const createOCC = protectedProcedure
  .input(
    z.object({
      occTemplateId: z.number(),
      // TODO: accept txHash
      // txHash: z.string(),
    }),
  )
  .mutation(async ({ ctx: { session }, input: { occTemplateId } }) => {
    const occ = await db.occ.create({
      data: {
        userId: session.userId,
        occTemplateId,
      },
    });

    return {
      id: occ.id,
    };
  });
