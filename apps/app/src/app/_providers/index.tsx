"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { posthog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "../../env";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";
const TonConnectUIProvider = dynamic(
  () => import("@tonconnect/ui-react").then((mod) => mod.TonConnectUIProvider),
  { ssr: false },
);

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: function (ph) {
      if (env.NEXT_PUBLIC_G3_ENV === "development") {
        console.log(`Removing PostHog session recording`);
        ph.opt_out_capturing(); // opts a user out of event capture
        ph.set_config({ disable_session_recording: true });
      }
    },
  });
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      env.NEXT_PUBLIC_G3_ENV !== "production"
    ) {
      void import("eruda").then(({ default: eruda }) => eruda.init());
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <TRPCReactProvider>
        <TonConnectUIProvider manifestUrl={env.NEXT_PUBLIC_TWA_MANIFEST_URL}>
          <SDKProvider acceptCustomStyles>
            <BackendAuthProvider>
              {children}

              <ProgressBar color="#14DB60" />
            </BackendAuthProvider>
          </SDKProvider>
        </TonConnectUIProvider>
      </TRPCReactProvider>
    </PostHogProvider>
  );
};
