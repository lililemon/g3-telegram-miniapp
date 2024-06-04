import { TRPCError } from "@trpc/server";
import PostHogClient, { Flag } from "../../../services/posthog";
import { type IQuest } from "./BaseQuest";
import { BindWalletAddressTask } from "./BindWalletAddressTask";
import { JoinCommunityTask } from "./JoinCommunityQuest";
import { type QuestId } from "./QuestId";
import { QuestStatus } from "./QuestStatus";

export class QuestService {
  // singleton
  static instance: QuestService;
  static getInstance() {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private async _getTasks() {
    const _tasks: IQuest[] = [new BindWalletAddressTask()];
    const client = PostHogClient();
    if (await client.isFeatureEnabled(Flag.join_g3_community, "default")) {
      _tasks.push(new JoinCommunityTask());
    }

    return _tasks;
  }

  async getTasks({
    taskType,
    userId,
  }: {
    taskType: QuestStatus;
    userId: number;
  }) {
    const _tasks = await this._getTasks();

    const _getTaskWithFilter = (taskType: QuestStatus) => {
      switch (taskType) {
        case QuestStatus.ALL:
          return _tasks;
        case QuestStatus.COMPLETED:
          return _tasks.filter(async (task) => {
            return await task.isQuestCompleted({ userId });
          });
        case QuestStatus.INCOMPLETE:
          return _tasks.filter(async (task) => {
            return !(await task.isQuestCompleted({ userId }));
          });
        default:
          return [];
      }
    };

    return Promise.all(
      _getTaskWithFilter(taskType).map(async (task) => {
        const [isClaimed, isFinishedQuest] = await Promise.all([
          task.isRewardAlreadyGiven({ userId }).catch(() => false),
          task.isUserFinishedQuest({ userId }).catch(() => false),
        ]);

        return {
          id: task.id,
          points: task.points,
          metadata: await task.getQuestMetadata({
            userId,
          }),
          title: task.title,
          description: task.description,
          text: task.text,
          isClaimed,
          isFinishedQuest,
        };
      }),
    );
  }

  async completeTaskOrThrow({
    taskId,
    userId,
  }: {
    taskId: QuestId;
    userId: number;
  }): Promise<void> {
    const _tasks = await this._getTasks();
    const task = _tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Task not found",
      });
    }

    await task.completeQuestOrThrow({ userId });
  }
}
