"use client";
import {
  decodeFont,
  decodeImage,
  type FontAsset,
  type ImageAsset,
} from "@rive-app/canvas";
import { useRive } from "@rive-app/react-canvas";
import { memo, useEffect, useRef, useState } from "react";
import { getGifFromImages } from "../../rive/getGifFromImages";

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
    const setRenderImage = useRef<(imgUrl: string) => void>();
    const [recording, setRecording] = useState<"idle" | "recording" | "done">(
      "idle",
    );

    const { RiveComponent, canvas, rive } = useRive({
      src: "/rive/sample1/untitled.riv",
      autoplay: true,
      assetLoader: (_asset) => {
        switch (true) {
          case _asset.isImage: {
            const asset = _asset as ImageAsset;

            if (asset.name === "NFT") {
              const switchImg = (imgUrl: string) => {
                void fetch(imgUrl)
                  .then((res) => res.arrayBuffer())
                  .then(async (data) => {
                    const image = await decodeImage(new Uint8Array(data));

                    asset.setRenderImage(image);
                  });
              };

              setRenderImage.current = switchImg;
              switchImg(imageUrl);

              return true;
            }

            return false;
          }
          case _asset.isFont: {
            const asset = _asset as FontAsset;

            // Bebas Neue-593220.ttf
            if (asset.name === "Bebas Neue") {
              void fetch("/rive/sample1/Bebas Neue-593220.ttf")
                .then((res) => res.arrayBuffer())
                .then(async (buffer) => {
                  const font = await decodeFont(new Uint8Array(buffer));

                  asset.setFont(font);
                });

              return true;
            }
          }

          default: {
            return false;
          }
        }
      },
      onLoop: () => {
        if (interval.current) {
          clearInterval(interval.current);

          setRecording("done");
        }
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
      if (imageUrl && setRenderImage.current) {
        setRenderImage.current(imageUrl ?? "/rive/sample1/NFT-1597881.png");
      }
    }, [imageUrl]);

    return (
      <div className="relative overflow-hidden rounded-xl border-2">
        <RiveComponent width="100%" className="aspect-square" />
      </div>
    );
  },
);

Sample1.displayName = "Sample1";
