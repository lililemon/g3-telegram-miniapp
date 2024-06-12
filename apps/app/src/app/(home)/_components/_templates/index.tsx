// StickerTemplate

import { StickerType } from "database";
import { Sample1 } from "./Sample1";

export const mapStickerTypeToTemplateComponent = (
  stickerType: StickerType,
  props: any,
) => {
  switch (stickerType) {
    case StickerType.Sample1: {
      return <Sample1 {...props} />;
    }
  }
  return null;
};
