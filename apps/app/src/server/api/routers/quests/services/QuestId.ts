export enum QuestId {
  JOIN_COMMUNITY = "JOIN_COMMUNITY",
  BIND_WALLET_ADDRESS = "BIND_WALLET_ADDRESS",
}

export const mapQuestIdToTitle: Record<QuestId, string> = {
  [QuestId.JOIN_COMMUNITY]: "Join Community",
  [QuestId.BIND_WALLET_ADDRESS]: "Bind Wallet Address",
};
