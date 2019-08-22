import React from "react";
import { sendMessageToActiveTabContentScript } from "../shared/Messenger";

const getDimensions = url => {
  return new Promise((res, rej) => {
    try {
      const img = new Image();
      img.onload = function() {
        const width = this.naturalWidth;
        const height = this.naturalHeight;
        res({
          url,
          width,
          height,
        });
      };

      img.src = url;
    } catch (error) {
      console.log("getDimensions error: ", error.message);
      rej(error);
    }
  });
};

function PopupHome() {
  const [srcs, setSrcs] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [minWidth, setMinWidth] = React.useState(100);
  // const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(100);
  // const [maxHeight, setMaxHeight] = React.useState(100);
  const [loading, setLoading] = React.useState(false);

  const updateImages = async () => {
    try {
      setLoading(true);
      const response = await sendMessageToActiveTabContentScript({
        task: "collect",
      });

      const image_urls = response.srcs || [];
      const imgMeta = await Promise.all(image_urls.map(getDimensions));

      const filteredImageUrls = imgMeta
        .filter(meta => {
          const { height, width } = meta;
          return height >= minHeight && width >= minWidth;
        })
        .map(x => x.url);
      setLoading(false);
      setSrcs(filteredImageUrls);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const onClick = async e => {
    e.preventDefault();
    updateImages();
  };

  const showGallery = async () => {
    await sendMessageToActiveTabContentScript({
      task: "show_gallery",
    });
    // browser.runtime.openOptionsPage();
    // browser.tabs.create({
    //   url: "chrome://extensions/?options=" + chrome.runtime.id
    // });
  };

  return (
    <div style={{ width: 800 }}>
      <button onClick={() => onClick()}>
        {loading ? "Loading" : "Collect Images"}
      </button>
      <button onClick={() => showGallery()}>Show Gallery</button>
      <div className="d-flex">
        Min Width:
        <input
          type="number"
          placeholder="width"
          min="1"
          value={minWidth}
          onChange={e => setMinWidth(e.target.value || 5)}
        />
        Min Height:
        <input
          type="number"
          placeholder="height"
          min="1"
          value={minHeight}
          onChange={e => setMinHeight(e.target.value || 5)}
        />
        Cols:
        <input
          type="number"
          placeholder="height"
          min="1"
          max="10"
          value={cols}
          onChange={e => setCols(e.target.value || 2)}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cols}fr)`,
          gridGap: "1px",
          gridAutoFlow: "dense",
        }}
      >
        {srcs.map((src, i) => {
          return (
            <span key={i}>
              <img
                src={src}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
              ;
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PopupHome;
