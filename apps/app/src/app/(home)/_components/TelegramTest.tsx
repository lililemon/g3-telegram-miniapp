"use client";
import { Button, Code, Heading } from "@radix-ui/themes";
import { useInitData } from "@tma.js/sdk-react";
import { useMiniApp } from "../../_providers/MiniappProvider";

export const TelegramTest = () => {
  const initData = useInitData();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { miniApp } = useMiniApp();
  const isBotInline = miniApp?.isBotInline;

  return (
    <>
      <Heading>Telegram Test</Heading>

      {initData && <Code>{JSON.stringify(initData, null, 2)}</Code>}

      <p>isBotInline: {isBotInline ? "true" : "false"}</p>

      <Button
        onClick={() => {
          // switchInlineQuery("hello_tin", ["groups", "users"]);
          miniApp?.switchInlineQuery("hello_tin", ["groups", "users"]);
        }}
      >
        Click me to share
      </Button>
    </>
  );
};
