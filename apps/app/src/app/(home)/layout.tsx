"use client";
import { Box } from "@radix-ui/themes";
import { cn } from "@repo/utils";
import {
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams,
} from "@tma.js/sdk-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";

const BackButton = dynamic(
  () => import("@twa-dev/sdk/react").then((mod) => mod.BackButton),
  {
    ssr: false,
  },
);

if (typeof window !== "undefined") {
  try {
    retrieveLaunchParams();
  } catch {
    const initDataRaw = new URLSearchParams([
      [
        "user",
        JSON.stringify({
          id: "1216103870",
          first_name: "Andrew",
          last_name: "Tin",
          username: "pnpminstall",
          language_code: "en",
          is_premium: true,
          allows_write_to_pm: true,
        }),
      ],
      [
        "hash",
        "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31",
      ],
      ["auth_date", "1716922846"],
      ["start_param", "debug"],
      ["chat_type", "sender"],
      ["chat_instance", "8428209589180549439"],
    ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: "#6ab2f2",
        bgColor: "#17212b",
        buttonColor: "#5288c1",
        buttonTextColor: "#ffffff",
        destructiveTextColor: "#ec3942",
        headerBgColor: "#17212b",
        hintColor: "#708499",
        linkColor: "#6ab3f3",
        secondaryBgColor: "#232e3c",
        sectionBgColor: "#17212b",
        sectionHeaderTextColor: "#6ab3f3",
        subtitleTextColor: "#708499",
        textColor: "#f5f5f5",
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: "7.2",
      platform: "tdesktop",
    });
  }
}

const fluidPages: RegExp[] = [
  // /create
  /\/create\/?/,
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Box
      className="min-h-screen xl:py-2"
      style={{
        background: "var(--black-a10)",
      }}
    >
      <Box className="container bg-white xl:rounded-lg" position="relative">
        {pathname !== "/" && <BackButton />}

        <div className="sticky top-0 z-50 bg-white p-4">
          <Header />
        </div>

        <div
          className={cn("flex min-h-[82vh] flex-col p-4", {
            "p-0": fluidPages.some((re) => re.test(pathname)),
          })}
        >
          {children}
        </div>

        <Footer />
      </Box>
    </Box>
  );
}
