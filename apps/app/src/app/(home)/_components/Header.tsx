"use client";
import { Button, Flex, Heading } from "@radix-ui/themes";
import { formatNumber } from "@repo/utils";
import { TonConnectButton } from "@tonconnect/ui-react";
import Link from "next/link";
import { api } from "../../../trpc/react";
import { useIsAuthenticated } from "../../_providers/useAuth";

export const Header = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data, isPending, isSuccess } = api.auth.getCurrentUser.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    },
  );

  return (
    <>
      <Flex justify="between" gap="2" align="center">
        <Link href="/">
          <Heading color="gray">MiniApp</Heading>
        </Link>

        {isSuccess && (
          <Button size="3" variant="solid" color="lime" loading={isPending}>
            <span>{formatNumber(data.point)} pts</span>
          </Button>
        )}

        <TonConnectButton />
      </Flex>
    </>
  );
};
