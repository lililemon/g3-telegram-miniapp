import { type NextRequest } from "next/server";
import sharp from "sharp";

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get("url");
  const response = await fetch(url!);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();

  // resize image to 1000x1000
  const _blob = await sharp(buffer).resize(1000, 1000).toBuffer();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new Response(_blob, {
    headers: {
      "Content-Type": blob.type,
    },
  });
};
