"use client";
import {
  Badge,
  Button,
  Card,
  DataList,
  Dialog,
  Spinner,
} from "@radix-ui/themes";
import { useInitData } from "@tma.js/sdk-react";
import { useRouter } from "next-nprogress-bar";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { env } from "../../../env";
import { OccType } from "../../../server/api/routers/occ/OccType";
import { api } from "../../../trpc/react";
import { useNftContract } from "../../_hooks/useNftContract";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { mapStickerTypeToTemplateComponent } from "../_components/_templates";
import { IconLock } from "../templates/[id]/_components/IconLock";
import { MOCK_TX_HASH } from "./MOCK_TX_HASH";
import { useWebAppSwitchInlineQuery } from "./useWebAppSwitchInlineQuery";

export const MintOCC = () => {
  const { sendMintNftFromFaucet } = useNftContract();
  const router = useRouter();
  const { mutateAsync } = api.occ.createOCC.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useIsAuthenticated();
  const { data: occ, isPending } = api.occ.getOcc.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: stickers } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const initData = useInitData(true);
  const [stickerId, setStickerId] = useQueryState("stickerId", parseAsInteger);
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();

  if (isPending) return <Spinner mx="auto" />;

  return occ ? (
    <div>
      <Card>
        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Total share</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {occ.totalShare}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Total reactions</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {occ.totalReaction}
              </Badge>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>

      {stickers && stickers.length > 0 && (
        <div className="mt-2 grid grid-cols-2">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              onClick={() => {
                void setStickerId(sticker.id);
              }}
            >
              <div className="aspect-square cursor-pointer">
                {mapStickerTypeToTemplateComponent(sticker.stickerType)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog.Root
        open={stickerId !== null}
        onOpenChange={(open) => {
          if (!open) {
            void setStickerId(null);
          }
        }}
      >
        <Dialog.Content className="container">
          <div className="flex justify-center">
            <Button
              mt="2"
              size="4"
              onClick={() => {
                const { telegramUserId } = z
                  .object({
                    telegramUserId: z.coerce.number(),
                  })
                  .parse({
                    telegramUserId: initData?.user?.id,
                  });

                postSwitchInlineQuery({
                  query: `${stickerId} ${telegramUserId}`,
                  chatTypes: ["channels", "groups", "users"],
                });
              }}
            >
              Share
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ) : (
    <Button
      radius="large"
      size="4"
      className="flex-1"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const txHash =
            env.NODE_ENV === "development"
              ? MOCK_TX_HASH
              : await sendMintNftFromFaucet({
                  name: "Name Of NFT #6",
                  description: "NFT Description",
                  image:
                    "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
                });

          await toast.promise(
            mutateAsync({
              type: OccType.GMSymbolOCC,
              txHash,
            }),
            {
              loading: "Creating OCC...",
              success: (data) => {
                void router.replace(`/occ/${data.id}`);

                return "OCC created";
              },
              error: (e) => {
                console.log(`Failed to create OCC:`, e);

                return "Failed to create OCC";
              },
            },
          );
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <Spinner loading={isLoading}>
          <div className="size-6">
            <IconLock />
          </div>
        </Spinner>
        <div className="text-xl font-bold leading-7 text-slate-900">
          Unlock this EPIC
        </div>
      </div>

      <div className="grow text-right text-xl font-bold leading-7 text-slate-900">
        0.1 $TON
      </div>
    </Button>
  );
};
