import { StickerType } from "database";
import { db } from "../../../db";

export class StickerService {
  private static instance: StickerService;

  public static getInstance(): StickerService {
    if (!StickerService.instance) {
      StickerService.instance = new StickerService();
    }

    return StickerService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async unlockSticker({
    stickerType,
    occId,
  }: {
    stickerType: StickerType;
    occId: number;
  }) {
    switch (stickerType) {
      case StickerType.Sample1: {
        return db.$transaction(async (db) => {
          const _existed = await db.sticker.findFirst({
            where: {
              stickerType,
              GMSymbolOCC: {
                occId,
              },
            },
          });

          if (_existed) {
            return {
              id: _existed.id,
            };
          }

          const sticker = await db.sticker.create({
            data: {
              stickerType,
              GMSymbolOCC: {
                connectOrCreate: {
                  create: {
                    occId,
                  },
                  where: {
                    occId,
                  },
                },
              },
            },
          });

          return {
            id: sticker.id,
          };
        });
      }
      default:
        throw new Error("Invalid sticker type");
    }
  }
}
