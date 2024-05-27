import { Telegraf } from "telegraf";
import { InlineQueryResult, InputTextMessageContent } from "telegraf/types";
import { TelegramClient, tl } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { COMMANDS, MAP_COMMAND_TO_DESCRIPTION } from "./commands";
import { db } from "./utils/db";

const apiId = 25258261;
const apiHash = "ecdcb0e838175aee63d57acdbf9c76b0";
const stringSession = new StringSession();

export class BotApp {
  private static instance: BotApp;
  private static botToken = "6963110935:AAFAgq9J5qo7Z3TL5YOWAmt1PQhCmke1_3U";
  private bot = new Telegraf(BotApp.botToken);

  private telegramClient = new TelegramClient(
    stringSession,
    apiId,
    apiHash,
    {}
  );

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
      // /get_reaction <group_id> <message_id>
      const groupId = "testabc1234578";
      const messageId = 50;
      console.log(`im here`);
      const channel = await this.telegramClient.invoke(
        new tl.Api.contacts.ResolveUsername({ username: groupId })
      );

      console.log({
        accessHash: (channel.peer as unknown as tl.Api.InputPeerChannel)
          .accessHash,
        channel: JSON.stringify(channel.peer, null, 2),
      });

      // const reactions = await this.telegramClient.invoke(
      //   new tl.Api.messages.GetMessageReactionsList({
      //     id: messageId,
      //     peer: new tl.Api.InputPeerChannel({
      //       accessHash,
      //       channelId,
      //     }),
      //   })
      // );

      // console.log({
      //   reactions,
      // });

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
    });
    bot.on("chosen_inline_result", async (ctx) => {
      console.log(`Received chosen inline result,`, ctx.chosenInlineResult);
    });
  }

  private async _initializeClient() {
    await this.telegramClient.start({
      botAuthToken: BotApp.botToken,
    });
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
