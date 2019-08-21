import React from "react";

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
          height
        });
      };

      img.src = url;
    } catch (error) {
      console.log(`getDimensions error: `, error);
      rej(error);
    }
  });
};

function PopupHome() {
  const [srcs, setSrcs] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [minWidth, setMinWidth] = React.useState(100);
  const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(100);
  const [maxHeight, setMaxHeight] = React.useState(100);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(
        "request, sender, sendResponse:",
        request,
        sender,
        sendResponse
      );
    });
  }, []);

  const updateImages = async () => {
    try {
      setLoading(true);
      const tabs = await browser.tabs.query({
        currentWindow: true,
        active: true
      });
      const tab = tabs.length ? tabs[0] : null;

      if (!tab) {
        throw new Error("No tabs active");
      }

      const response = await browser.tabs.sendMessage(tab.id, {
        task: "collect"
      });
      console.log("response:", response);

      const image_urls = response.srcs || [];
      console.log("image_urls:", image_urls);
      const imgMeta = await Promise.all(image_urls.map(getDimensions));
      console.log("imgMeta:", imgMeta);

      const filteredImageUrls = imgMeta
        .filter(meta => {
          console.log("meta:", meta);
          const { height, width } = meta;
          return height >= minHeight && width >= minWidth;
        })
        .map(x => x.url);
      console.log("filteredImageUrls:", filteredImageUrls);
      setLoading(false);
      setSrcs(filteredImageUrls);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    updateImages();
  }, [minWidth, maxWidth, minHeight, maxHeight]);

  const onClick = async e => {
    updateImages();
  };

  const openOptions = () => {
    browser.runtime.openOptionsPage();
    // browser.tabs.create({
    //   url: "chrome://extensions/?options=" + chrome.runtime.id
    // });
  };

  return (
    <>
      <button disabled={loading} onClick={() => onClick()}>
        {loading ? "Loading" : "Collect Images"}
      </button>
      <button onClick={openOptions}>Open Options</button>
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
          width: 800,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cols}fr)`,
          gridGap: "1px",
          gridAutoFlow: "dense"
        }}
      >
        {srcs.map((src, i) => {
          return (
            <span key={i}>
              <img
                src={src}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
              ;
            </span>
          );
        })}
      </div>
      {}
    </>
  );
}

export default PopupHome;
