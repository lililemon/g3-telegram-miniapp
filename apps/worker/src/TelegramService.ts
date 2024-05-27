import input from 'input';
import { groupBy, mapValues } from 'lodash-es';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';

export const apiId = 25258261;
export const apiHash = 'ecdcb0e838175aee63d57acdbf9c76b0';
export const stringSession = new StringSession(
  '1BQANOTEuMTA4LjU2LjE1MgG7N4/tCs0IrLXKOgw0XQzW94ofujRIgu/fqxLoKkCSgLv1p2SxdFBMbCgx5I+49OXOV/WIBhDIoNxG+LLkJ+7e0DFfesGQ2jxEkd//7q73CKQ4OgTtNSR2lgrJSbbptPzatkL28dL1c0wR+hN0qZxH8q7bRpYz9WeK17CxBn8N59yhADcjujHZ2nx6474auz5etcJqtOj1PlMdqBNRON4hkYQoIL9h4fcwq9IeCMU7vWRYQLmHX5C23DqvvMW4kVejcOrRUHuCzQgCQd5PYn5c2LVTBF99lIYKDU86ncE/SoB8d0yi4E7eGSGeceGvpyFNkQ+JwetITdWs64yMlTm/1w==',
);

export interface Dictionary<T> {
  [index: string]: T;
}

export class TelegramService {
  // singleton
  private static instance: TelegramService;

  private telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  private constructor() {}

  private async _initialize() {
    if (this.telegramClient.connected) {
      return;
    }

    console.log(`🚀 Initializing Telegram client...`);
    await this.telegramClient.start({
      phoneNumber: async () => await input.text('Please enter your number: '),
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () =>
        await input.text('Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    console.log(`🚀 Telegram client is ready!`);
  }

  public static async getInstance() {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
      await TelegramService.instance._initialize();
    }
    return TelegramService.instance;
  }

  async getReactionsByIds({
    groupName,
    ids,
  }: {
    groupName: string;
    ids: number[];
  }): Promise<
    Dictionary<
      {
        msgId: number;
        reactions: {
          [x: string]: Api.ReactionCount;
        };
      }[]
    >
  > {
    const reactions = (await this.telegramClient.invoke(
      new Api.messages.GetMessagesReactions({
        id: ids,
        peer: groupName,
      }),
    )) as unknown as Api.Updates;

    const results = groupBy(
      reactions.updates.map((update) => {
        if (update instanceof Api.UpdateMessageReactions) {
          return {
            msgId: update.msgId,
            reactions: mapValues(
              groupBy(update.reactions.results, 'reaction.emoticon'),
              (reactions) => {
                return reactions[0];
              },
            ),
          };
        } else {
          console.error('Unknown update', update);
          return null;
        }
      }),
      'msgId',
    );

    return results;
  }
}
