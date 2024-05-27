export enum COMMANDS {
  start = "start",
  greetings = "greetings",
  total_users = "total_users",
  share = "share",
  login = "login",
}

export const MAP_COMMAND_TO_DESCRIPTION: Record<COMMANDS, string> = {
  start: "Start command",
  greetings: "Greetings command",
  total_users: "Total users",
  share: "Share",
  login: "Login",
} as const;
