"use client";

import { Button, Card, Section } from "@radix-ui/themes";
import { FaTelegram } from "react-icons/fa6";

interface PageParams {
  params: Params;
}

interface Params {
  id: string;
}

const Page = (pageParams: PageParams) => {
  return (
    <Card>
      <Section>{JSON.stringify(pageParams, null, 2)}</Section>

      <Button
        onClick={() => {
          // TODO: implement share button here
        }}
      >
        <FaTelegram />
        Share
      </Button>
    </Card>
  );
};

export default Page;
