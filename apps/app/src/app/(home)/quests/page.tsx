"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Spinner } from "@radix-ui/themes";
import { TRPCClientError } from "@trpc/client";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { QuestId } from "~/server/api/routers/quests/services/QuestId";
import { QuestStatus } from "~/server/api/routers/quests/services/QuestStatus";
import { api } from "../../../trpc/react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { CurrentPoint } from "./CurrentPoint";
import { QuestItem } from "./QuestItem";

type NonNullable<T> = Exclude<T, null | undefined>;

const Page = () => {
  const {
    data: items,
    isSuccess,
    isPending,
  } = api.quests.getQuests.useQuery(
    {
      type: QuestStatus.ALL,
    },
    {
      refetchOnWindowFocus: true,
    },
  );
  const [parent] = useAutoAnimate();
  const utils = api.useUtils();
  const { mutateAsync: completeTask } = api.quests.completeTask.useMutation({
    onSuccess: () => {
      void utils.quests.getQuests.invalidate();
    },
  });

  const renderItem = useCallback(
    (item: NonNullable<typeof items>[number]) => {
      switch (item.id) {
        case QuestId.JOIN_COMMUNITY: {
          const { success, data } = z
            .object({ chatId: z.string() })
            .safeParse(item.metadata);

          if (!success) {
            return null;
          }

          const { chatId } = data;

          return (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={!item.isClaimed && item.isFinishedQuest}
              disabled={item.isClaimed}
              onClick={() => {
                if (!item.isFinishedQuest) {
                  const a = document.createElement("a");
                  // Telegram
                  a.href = `tg://resolve?domain=${chatId}`;
                  a.click();

                  return;
                }

                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: "Completing task...",
                  success: "Task completed!",
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return "An error occurred";
                  },
                });
              }}
            />
          );
        }

        default:
          return (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={item.isFinishedQuest && !item.isClaimed}
              disabled={item.isClaimed || !item.isFinishedQuest}
              onClick={() => {
                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: "Completing task...",
                  success: "Task completed!",
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return "An error occurred";
                  },
                });
              }}
            />
          );
      }
    },
    [completeTask],
  );

  return (
    <div>
      <CurrentPoint />

      <div className="mt-4 space-y-3" ref={parent}>
        <Spinner loading={isPending}>
          {isSuccess && items.map((item) => renderItem(item))}
        </Spinner>
      </div>
    </div>
  );
};

function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
}

export default PageWrapper;
