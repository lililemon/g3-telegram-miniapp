import fs from "fs/promises";
import input from "input";
import { groupBy } from "lodash-es";
import { Telegraf } from "telegraf";
import { InlineQueryResult, InputTextMessageContent } from "telegraf/types";
import { Api, TelegramClient, tl } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { COMMANDS, MAP_COMMAND_TO_DESCRIPTION } from "./commands";
import { db } from "./utils/db";

const apiId = 25258261;
const apiHash = "ecdcb0e838175aee63d57acdbf9c76b0";
const stringSession = new StringSession(
  "1BQANOTEuMTA4LjU2LjE1MgG7N4/tCs0IrLXKOgw0XQzW94ofujRIgu/fqxLoKkCSgLv1p2SxdFBMbCgx5I+49OXOV/WIBhDIoNxG+LLkJ+7e0DFfesGQ2jxEkd//7q73CKQ4OgTtNSR2lgrJSbbptPzatkL28dL1c0wR+hN0qZxH8q7bRpYz9WeK17CxBn8N59yhADcjujHZ2nx6474auz5etcJqtOj1PlMdqBNRON4hkYQoIL9h4fcwq9IeCMU7vWRYQLmHX5C23DqvvMW4kVejcOrRUHuCzQgCQd5PYn5c2LVTBF99lIYKDU86ncE/SoB8d0yi4E7eGSGeceGvpyFNkQ+JwetITdWs64yMlTm/1w=="
);
const botToken = "7162609772:AAEM7x3Kfeta5CBesezv5gdD5youN6CsnBI";

export class BotApp {
  private static instance: BotApp;
  private bot = new Telegraf(botToken);

  private telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  private constructor() {}

  public static getInstance(): BotApp {
    if (!BotApp.instance) {
      BotApp.instance = new BotApp();
    }

    return BotApp.instance;
  }

  private _initializeCommands() {
    const bot = this.bot;

    bot.telegram.setMyCommands(
      Object.entries(MAP_COMMAND_TO_DESCRIPTION).map(
        ([command, description]) => ({
          command,
          description,
        })
      )
    );
    bot.command(COMMANDS.start, async (ctx) => {
      await ctx.reply(`Hello @${ctx.from?.username}!`);
    });
    bot.command(COMMANDS.greetings, (ctx) => ctx.reply("Hello!!!"));
    bot.command(COMMANDS.total_users, async (ctx) => {
      const totalUsers = await db.provider.count();
      await ctx.reply(`Total users: ${totalUsers}`);
    });
    bot.command(COMMANDS.share, async (ctx) => {
      await ctx.reply("Share this bot with your friends! 🚀", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Share",
                switch_inline_query: "play_game",
              },
            ],
          ],
        },
      });
    });
    bot.command(COMMANDS.get_reaction, async (ctx) => {
      console.log(`Getting reaction for message ${ctx.message?.message_id}`);
      const groupName = "rust_vn";
      const messageIds = [2375];
      const channel = (await this.telegramClient.invoke(
        new tl.Api.contacts.ResolveUsername({
          username: groupName,
        })
      )) as tl.Api.contacts.ResolvedPeer;

      // save to file
      const fileName = `./channels/${groupName}.json`;
      // mkdir if not exists
      await fs.mkdir("./channels", { recursive: true });
      await fs.writeFile(fileName, JSON.stringify(channel, null, 2));

      const { chats } = channel;
      const chat = chats?.[0] as Api.Channel;
      const accessHash = chat?.accessHash;
      const channelId = chat.id;

      if (!chat || !accessHash || !channelId) {
        ctx.reply(`Channel ${groupName} not found`);
        return;
      }

      // console.log(`Getting reactions for message ${messageIds}`);
      const reactions = (await this.telegramClient.invoke(
        new Api.messages.GetMessagesReactions({
          id: messageIds,
          peer: new Api.InputPeerChannel({
            channelId: channelId,
            accessHash: accessHash,
          }),
        })
      )) as unknown as Api.Updates;

      reactions.updates.forEach((update) => {
        if (update instanceof Api.UpdateMessageReactions) {
          console.log(groupBy(update.reactions.results, "reaction.emoticon"));
        } else {
          console.error("Unknown update", update);
        }
      });

      // // save to file
      // const reactionsFileName = `./reactions/${messageId}.json`;
      // // mkdir if not exists
      // await fs.mkdir("./reactions", { recursive: true });
      // await fs.writeFile(reactionsFileName, JSON.stringify(reactions, null, 2));

      // ctx.reply(
      //   `Reactions for message ${messageId}: ${reactions.users.length}`
      // );
    });
  }

  private _initializeListeners() {
    const bot = this.bot;
    bot.on("callback_query", async (ctx) => {
      console.log(`Received callback query`, ctx.callbackQuery);

      // Explicit usage
      await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

      // Using context shortcut
      await ctx.answerCbQuery();
    });
    bot.on("inline_query", async (ctx) => {
      const result: InlineQueryResult[] = [
        {
          type: "article",
          id: "1",
          title: "TIN TON 💎🐈‍⬛ THE BIGGEST GAMING COMMUNITY 👾",
          thumbnail_url:
            "https://www.gall3ry.io/assets/landing/union/gall3ry-logo-squared.png",
          input_message_content: {
            message_text: `
@${ctx.inlineQuery.from.username} invites you to join 
                    
*TIN TON 💎🐈‍⬛ THE BIGGEST GAMING COMMUNITY 👾
                    
🚨 Farming LAUNCH 🚨
                    
🚀 Play Game 🚀
👨‍🎤 Join Clans 👩‍🎤
🐈‍⬛ Invite Cats 🐈‍⬛

💲 FARM $TINS 💲*`,
            link_preview_options: {
              prefer_large_media: true,
              prefer_small_media: false,
              show_above_text: false,
              url: "https://m3mefest.gall3ry.io/images/thumbnail.png",
            },
            parse_mode: "MarkdownV2",
          } as InputTextMessageContent,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Play",
                  url: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || "g3stgbot"}/appname`,
                },
              ],
            ],
          },
        },
      ];

      // Explicit usage
      await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

      if (!ctx.inlineQuery.from.username || !ctx.inlineQuery.chat_type) {
        // Do nothing
        return;
      }

      // Using context shortcut
      await ctx.answerInlineQuery(result);
    });

    bot.on("message", async (ctx) => {
      console.log("message", ctx);

      const { message } = ctx;

      switch (true) {
        case message.chat.type === "supergroup": {
          console.log(`Received message in supergroup,`, message);

          break;
        }
      }

      // save to file
      const fileName = `./messages/${ctx.message?.message_id}.json`;
      // mkdir if not exists
      await fs.mkdir("./messages", { recursive: true });
      await fs.writeFile(fileName, JSON.stringify(ctx.message, null, 2));
    });
    bot.on("chosen_inline_result", async (ctx) => {
      console.log(`Received chosen inline result,`, ctx.chosenInlineResult);
    });
  }

  private async _initializeClient() {
    console.log(`🚀 Initializing Telegram client...`);
    await this.telegramClient.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });

    console.log(
      `🚀 Telegram client is ready!`
      // this.telegramClient.session.save()
    );
  }

  public async launch() {
    const bot = this.bot;
    this._initializeCommands();
    this._initializeListeners();
    await this._initializeClient();

    console.log(`✅ Bot is running!`);

    if (process.env.environment == "PRODUCTION") {
      bot
        .launch({
          webhook: {
            domain: process.env.DOMAIN as string, // Your domain URL (where server code will be deployed)
            port: (process.env.PORT as unknown as number) || 8000,
          },
        })
        .then(() => {
          console.info(`The bot ${bot.botInfo?.username} is running on server`);
        });
    } else {
      // if local use Long-polling
      bot.launch().then(() => {
        console.info(`The bot ${bot.botInfo?.username} is running locally`);
      });
    }

    // Enable graceful stop
    process.once("SIGINT", () => {
      console.log("SIGINT");
      return bot.stop("SIGINT");
    });
    process.once("SIGTERM", () => {
      console.log("SIGTERM");
      return bot.stop("SIGTERM");
    });
  }
}
