"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";

// Manifest URL must be https with a public domain
const MANIFEST_URL =
  "https://gist.githubusercontent.com/g3-tin/635922e04226c2ce116a2f0586b46858/raw/6351ce742bbe0f82d99bae93e5095eb8efc1c441/tonconnect-manifest.json";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCReactProvider>
      <TonConnectUIProvider
        manifestUrl={MANIFEST_URL}
        // actionsConfiguration={{
        //   twaReturnUrl: "https://t.me/g3stgbot",
        // }}
      >
        <BackendAuthProvider>{children}</BackendAuthProvider>
      </TonConnectUIProvider>
    </TRPCReactProvider>
  );
};
