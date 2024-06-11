"use client";
import {
  decodeFont,
  decodeImage,
  type FontAsset,
  type ImageAsset,
} from "@rive-app/canvas";
import { useRive } from "@rive-app/react-canvas";
import { memo, useEffect, useRef, useState } from "react";
import { useLogger } from "react-use";
import { getGifFromImages } from "../../rive/getGifFromImages";

const loadAndDecodeImg = async (url: string) => {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  return await decodeImage(new Uint8Array(data));
};
const loadAndDecodeFont = async (url: string) => {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  return await decodeFont(new Uint8Array(data));
};

export const Sample1 = memo(
  ({
    shouldRecord = false,
    imageUrl,
  }: {
    shouldRecord?: boolean;
    imageUrl: string;
  }) => {
    const [images, setImages] = useState<string[]>([]);
    const interval = useRef<ReturnType<typeof setInterval>>();
    const [recording, setRecording] = useState<"idle" | "recording" | "done">(
      "idle",
    );
    const [nftAsset, setNftAsset] = useState<ImageAsset | null>(null);

    const { RiveComponent, canvas, rive } = useRive({
      src: "/rive/sample1/untitled.riv",
      autoplay: true,
      assetLoader: (_asset, bytes) => {
        const asset = _asset;
        console.log("Asset properties to query", {
          name: asset.name,
          fileExtension: asset.fileExtension,
          cdnUuid: asset.cdnUuid,
          isFont: asset.isFont,
          isImage: asset.isImage,
          bytes,
        });

        // If the asset has a `cdnUuid`, return false to let the runtime handle
        // loading it in from a CDN. Or if there are bytes found for the asset
        // (aka, it was embedded), return false as there's no work needed here
        if (asset.cdnUuid.length > 0 || bytes.length > 0) {
          return false;
        }

        switch (true) {
          case _asset.isImage: {
            const asset = _asset as ImageAsset;

            if (asset.name === "NFT") {
              setNftAsset(asset);

              return true;
            }

            break;
          }
          case _asset.isFont: {
            const asset = _asset as FontAsset;

            // Bebas Neue-593220.ttf
            if (asset.name === "Bebas Neue") {
              loadAndDecodeFont("/rive/sample1/Bebas Neue-593220.ttf")
                .then((font) => {
                  asset.setFont(font);
                })
                .catch((e) => {
                  console.error(e);
                });

              return true;
            }
            break;
          }
        }

        return false;
      },
      onLoop: () => {
        if (interval.current) {
          clearInterval(interval.current);

          setRecording("done");
        }
      },
      onLoad: () => {
        // Prevent a blurry canvas by using the device pixel ratio
        rive?.resizeDrawingSurfaceToCanvas();
      },
    });

    const isInitialPlaying =
      recording === "idle" && rive?.isPlaying && shouldRecord;

    useEffect(() => {
      if (isInitialPlaying) {
        setRecording("recording");

        interval.current = setInterval(() => {
          // we dont check canvas here for performance reasons
          setImages((prev) => [...prev, canvas!.toDataURL()]);
        }, 100);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialPlaying]);

    useEffect(() => {
      if (recording === "done") {
        void getGifFromImages(images).then((image) => {
          // throw event
          const event = new CustomEvent("gif", { detail: image });
          window.dispatchEvent(event);

          return Promise.resolve();
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recording]);

    useEffect(() => {
      if (imageUrl && nftAsset && rive) {
        loadAndDecodeImg(imageUrl)
          .then((image) => {
            nftAsset.setRenderImage(image);
            rive.play();
          })
          .catch((e) => {
            console.error(e);
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl, nftAsset?.name, rive]);

    useLogger("isPlaying", rive?.isPlaying);

    return (
      <div className="relative overflow-hidden rounded-xl border-2">
        <RiveComponent width="100%" className="aspect-square" />
      </div>
    );
  },
);

Sample1.displayName = "Sample1";
