import { type Metadata } from "next";
import { unstable_noStore } from "next/cache";
import { db } from "../../../../server/db";
import { BottomActions } from "./BottomActions";
import { TemplateInfo } from "./TemplateInfo";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  unstable_noStore();
  const occ = await db.occ.findUniqueOrThrow({
    where: {
      id: +params.id,
    },
  });

  const title = `OCC #${occ.id}`;
  const images = [];

  if (occ.imageUrl) {
    images.push({
      url: occ.imageUrl,
    });
  }

  return {
    title,
    openGraph: {
      title,
      images,
    },
  } satisfies Metadata;
}

const TemplateId = () => {
  return (
    <div>
      <TemplateInfo />
      <BottomActions />
    </div>
  );
};

export default TemplateId;
