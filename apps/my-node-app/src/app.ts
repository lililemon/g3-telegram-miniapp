import readline from "readline";
import { Api, TelegramClient } from "telegram";
import { NewMessage } from "telegram/events";
import { StringSession } from "telegram/sessions";

const apiId = 25258261;
const apiHash = "ecdcb0e838175aee63d57acdbf9c76b0";
const stringSession = new StringSession();
// "1BQANOTEuMTA4LjU2LjE1MgG7mY5To3m/pUcnHtxONet31e9ytg1ptRkILpGV3oBoQxRfTtprRdn2wu8KlGHJmlWlXju0ODxI7LcUjpnwKLgqWNFA4nCLEl4p20y/eEWeul2F00XsFMq7lVcOD9Rc5ZTWMhhekQoos8P3RMD/z1mBmAw01oVfBn33VH4mAnVDOaRcD53Hov6railOLc76vRugtT03UhFzeqDfbNPPI25IOUt9msdVQboUhee5I7ch49xylRYf8MhxzEswnR1jLQKxn0SF7y8UUdzZRmgkhWpPVV8kpHt6yylT71DEvFHzQtNi59v5K6GIAGOdsuQIeh0YYdKsjMKijAqj08NvCQIFHg=="

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let client: TelegramClient;

const botUsername = "@G3TelegramMiniApp1_bot";

(async () => {
  console.log("Loading interactive example...");
  client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    botAuthToken: "6950081608:AAGHJhGDI9xZP9-ayWO9jr-Cn-oqSEWLvro",
    // phoneNumber: async () =>
    //   new Promise((resolve) =>
    //     rl.question("Please enter your number: ", resolve)
    //   ),
    // password: async () =>
    //   new Promise((resolve) =>
    //     rl.question("Please enter your password: ", resolve)
    //   ),
    // phoneCode: async () =>
    //   new Promise((resolve) =>
    //     rl.question("Please enter the code you received: ", resolve)
    //   ),
    // onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");

  client.addEventHandler(async (update: Api.TypeUpdate) => {
    if (update instanceof Api.UpdateBotInlineQuery) {
      const query = await client.invoke(
        new Api.messages.SetInlineBotResults({
          queryId: update.queryId,
          private: false,
          results: [
            new Api.InputBotInlineResult({
              id: "test_article",
              type: "article",
              title: "Hello, world!",
              description: "This is a test article",
              url: "https://example.com",
              thumb: new Api.InputWebDocument({
                url: "https://api.dicebear.com/8.x/micah/png?seed=123",
                size: 0,
                mimeType: "image/png",
                attributes: [],
              }),
              sendMessage: new Api.InputBotInlineMessageText({
                message: "Hello, world!",
              }),
            }),
            new Api.InputBotInlineResult({
              id: "alo",
              type: "article",
              title: "Share this OCC to your friends",
              description: "Share this OCC to your friends",
              url: "https://example.com",
              thumb: new Api.InputWebDocument({
                url: "https://api.dicebear.com/8.x/micah/png?seed=124",
                size: 0,
                mimeType: "image/png",
                attributes: [],
              }),
              sendMessage: new Api.InputBotInlineMessageText({
                message: "Hello, world!",
              }),
            }),
          ],
        })
      );

      console.log(query);
    }
  });

  client.addEventHandler(
    async (event) => {
      const { message } = event;
      console.log(`Receiving message`, message.message);

      const result: Api.messages.BotResults = await client.invoke(
        new Api.messages.GetInlineBotResults({
          bot: botUsername,
          peer: message.peerId,
          geoPoint: new Api.InputGeoPoint({
            lat: 8.24,
            long: 8.24,
            accuracyRadius: 43,
          }),
          query: "random string here",
          offset: "",
        })
      );

      console.log(result);

      // send inline bot result
      //   await client.invoke(
      //   new Api.messages.SendInlineBotResult({
      //     // bot: botUsername,
      //     queryId: result.queryId,
      //     userId: message.peerId,
      //     // id: result.results[0].id,
      //   })
      // );

      Api.BotInlineMediaResult;
    },
    new NewMessage({
      pattern: /^\/(hi)\s*(@?\w*|\d*)$/,
    })
  );
  console.log(`eventAdded`);
})();

// on exit
process.on("exit", () => {
  rl.close();
  console.log("Exiting...");
  if (client) {
    client.disconnect();
    console.log("Client disconnected");
  }
});
