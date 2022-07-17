import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import cssText from "data-text:~/style.css";
import type { PlasmoContentScript } from "plasmo";
import { useEffect, useMemo, useState } from "react";

const withTimeout = (millis, promise) => {
  const timeout = new Promise((resolve, reject) =>
    setTimeout(() => reject(`Timed out after ${millis} ms.`), millis)
  );
  return Promise.race([promise, timeout]);
};
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
  height: "calc(100% - 50px)",
  overflowY: "auto",
});

const StyledImage = styled(`img`, {
  height: 200,
  objectFit: "cover",
  aspectRatio: "9/16",
});

async function getAnchorLinks() {
  const selectors = ["jpg", "jpeg", "png", "gif", "webp"].map(
    (ext) => `a[href$='${ext}']`
  );
  const nodes = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector))
  );

  const links = nodes.map((node) => node.getAttribute("href"));

  return links;
}
async function getImgTags() {
  const nodes = Array.from(document.querySelectorAll("img"));
  const links = nodes.map((node) => node.getAttribute("src"));

  return links;
}

export default function GalleryOverlay() {
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
      const fromLinks = await getAnchorLinks();
      const fromImgTag = await getImgTags();
      const imgSet = new Set([...fromImgTag, ...fromLinks]);
      const sorted = Array.from(imgSet).sort();

      const filtered = sorted.map((url) => {
        const img = new Image();
        img.src = url;
        const pr = new Promise((resolve, reject) => {
          img.onload = () => {
            if ((img.naturalHeight > 100, img.naturalWidth > 100)) {
              resolve(url);
            } else {
              reject(new Error("too small"));
            }
          };
        });
        return withTimeout(2000, pr);
      });

      const results = await Promise.allSettled(filtered);

      const imagesBySize = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<string>).value);

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
                <Cross1Icon /> Close
              </Dialog.Close>
            </TopBar>
            <GalleryGrid>
              {filteredImages.map((url) => (
                <StyledImage key={url} src={url} alt={url} />
              ))}
            </GalleryGrid>
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
