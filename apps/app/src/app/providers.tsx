"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { BackendAuthProvider } from "./_providers/BackendAuthProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://g3-miniapp.vercel.app/tonconnect-manifest.json">
      <BackendAuthProvider>{children}</BackendAuthProvider>
    </TonConnectUIProvider>
  );
};
