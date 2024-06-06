"use client";
import { Button, Spinner } from "@radix-ui/themes";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Suspense, useMemo } from "react";
import { api } from "../../../trpc/react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { MyOCC } from "../_components/MyOCC";
import { EpicItem } from "./EpicItem";

enum Tab {
  EpicTemplates = "epicTemplates",
  CreatedEpics = "createdEpics",
}

const Page = () => {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.EpicTemplates),
  );

  const tabs = useMemo(
    () => [
      {
        name: "Epic templates",
        tab: Tab.EpicTemplates,
        child: <EpicItems />,
      },
      {
        name: "Created Epics",
        tab: Tab.CreatedEpics,
        child: <CreatedEpics />,
      },
    ],
    [],
  );

  const child = useMemo(
    () => tabs.find((t) => t.tab === tab)?.child,
    [tab, tabs],
  );

  return (
    <div>
      <div className="flex justify-center gap-2">
        {tabs.map(({ name, tab: tabName }) => (
          <Button
            key={tabName}
            color={tab === tabName ? undefined : "gray"}
            variant={tab === tabName ? "solid" : "outline"}
            onClick={() => setTab(tabName)}
            className="cursor-pointer"
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="mt-4">{child}</div>
    </div>
  );
};

const EpicItems = () => {
  const LIMIT = 10;
  const PAGE = 1;
  const { data, isPending, isSuccess } = api.occ.getEpicTemplates.useQuery({
    limit: LIMIT,
    page: PAGE,
  });

  return (
    <Spinner loading={isPending}>
      {isSuccess &&
        data.items.map((item) => (
          <EpicItem
            key={item.id}
            name={item.name}
            description={item.description}
            occMinted={item._count.Occ}
            hasYouMinted={false}
            href={`/templates/${item.id}`}
            participants={item.Occ.map((occ) => {
              return {
                id: occ.Provider.User.id,
                name: occ.Provider.User.displayName ?? "?",
                avatar: occ.Provider.User.avatarUrl ?? null,
              };
            })}
          />
        ))}
    </Spinner>
  );
};

const CreatedEpics = () => {
  return <MyOCC />;
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Suspense fallback={<Spinner mx="auto" />}>
        <Page />
      </Suspense>
    </LoggedUserOnly>
  );
}
