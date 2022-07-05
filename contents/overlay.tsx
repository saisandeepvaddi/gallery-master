import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import cssText from "data-text:~/style.css";
import type { PlasmoContentScript } from "plasmo";
import { useEffect, useMemo, useState } from "react";

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_idle",
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const Overlay = styled(Dialog.Overlay, {
  background: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  zIndex: 99999999,
});

const Content = styled(Dialog.Content, {
  background: "white",
  width: "80%",
  height: "80%",
  borderRadius: 4,
  overflow: "hidden",
  position: "relative",
});

const TopBar = styled(`div`, {
  height: 50,
  background: "lightgray",
  position: "sticky",
  top: 0,
});

const GalleryGrid = styled(`div`, {
  padding: 10,
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))`,
  gap: `10px 10px`,
  overflowY: "auto",
  height: "calc(100% - 50px)",
});

export default function OptionsPrice() {
  console.log("Content Script overlay loaded");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      console.log("message:", message);
      if (!message.task) {
        console.error("No Task");
        return;
      }
      if (message.task === "show-gallery") {
        // console.log("Sent Data: ", message.data);
        if (!showAlert) {
          setImages(message.data ?? []);
          setShowAlert(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!showAlert) {
      return;
    }
    async function filterImagesBySize() {
      const filtered = images.map((url) => {
        const img = new Image();
        img.src = url;
        return new Promise((resolve, reject) => {
          img.onload = () => {
            console.log("img.naturalHeight:", img.naturalHeight);
            if ((img.naturalHeight > 100, img.naturalWidth > 100)) {
              resolve(url);
            } else {
              reject(new Error("too small"));
            }
          };
        });
      });

      const results = await Promise.allSettled(filtered);
      console.log("results:", results);
      const imagesBySize = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      console.log("imagesBySize:", imagesBySize);
      setFilteredImages(imagesBySize);
    }
    filterImagesBySize();
  }, [images]);

  return (
    <Dialog.Root open={showAlert} defaultOpen={false}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Overlay>
          <Content>
            <TopBar>
              <Dialog.Close
                aria-label="Close"
                onClick={() => setShowAlert(false)}>
                <Cross1Icon />
              </Dialog.Close>
            </TopBar>
            <GalleryGrid>
              {filteredImages.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt={url}
                  style={{ height: 200, width: 100, objectFit: "scale-down" }}
                />
              ))}
            </GalleryGrid>
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
