"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useMemo } from "react";
import { env } from "../../env";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";
import { MiniappProvider } from "./MiniappProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const manifestUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URL("tonconnect-manifest.json", window.location.href).toString();
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      env.NEXT_PUBLIC_G3_ENV !== "production"
    ) {
      void import("eruda").then(({ default: eruda }) => eruda.init());
    }
  }, []);

  return (
    <TRPCReactProvider>
      <SDKProvider acceptCustomStyles debug>
        <TonConnectUIProvider
          manifestUrl={manifestUrl}
          // actionsConfiguration={{
          //   twaReturnUrl: "https://t.me/g3stgbot",
          // }}
        >
          <MiniappProvider>
            <BackendAuthProvider>{children}</BackendAuthProvider>
          </MiniappProvider>
        </TonConnectUIProvider>
      </SDKProvider>
    </TRPCReactProvider>
  );
};
