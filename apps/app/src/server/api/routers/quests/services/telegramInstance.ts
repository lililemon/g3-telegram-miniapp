import { TelegramService } from "@repo/telegram";
import { env } from "../../../../../env";

export const telegramInstance = new TelegramService(env.BOT_TOKEN);
