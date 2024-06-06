"use client";
import { Alignment, decodeImage, Fit, Layout } from "@rive-app/canvas";
import { useRive } from "@rive-app/react-canvas";

export const TestOccTemplate = () => {
  const { RiveComponent } = useRive({
    src: "/rive/test/robobutton_bar.riv",
    animations: "idle",
    stateMachines: "idle",
    artboard: "mainboard",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),

    assetLoader: (asset) => {
      if (asset.isImage) {
        if (asset.name === "ghost") {
          void fetch("/rive/test/ghost-1579267.webp")
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
              //decode image
              decodeImage(new Uint8Array(buffer)).then((image) => {
                //set image to asset
                (asset as any).setRenderImage(image);
              });
            });

          return true;
        }
        if (asset.name === "Su") {
          return false;
        }
      }

      return true;
    },
    onLoadError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="border-2">
      <RiveComponent width="100%" className="aspect-square" />
    </div>
  );
};
