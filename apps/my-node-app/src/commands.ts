export enum COMMANDS {
  start = "start",
  greetings = "greetings",
  total_users = "total_users",
  share = "share",
  login = "login",
  get_reaction = "get_reaction",
}

export const MAP_COMMAND_TO_DESCRIPTION: Record<COMMANDS, string> = {
  start: "Start command",
  greetings: "Greetings command",
  total_users: "Total users",
  share: "Share",
  login: "Login",
  get_reaction: "Get reaction by message ID",
} as const;
