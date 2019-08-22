import React from "react";

function OptionsHome() {
  const [srcs, setSrcs] = React.useState([]);
  const [minWidth, setMinWidth] = React.useState(50);
  // const [maxWidth, setMaxWidth] = React.useState(50);
  const [minHeight, setMinHeight] = React.useState(50);
  // const [maxHeight, setMaxHeight] = React.useState(50);

  const onClick = e => {
    e.preventDefault();
    browser.storage.local.get(["srcs"]).then(srcs => {
      const image_urls = srcs.srcs || [];
      const filteredImageUrls = image_urls.filter(url => {
        const img = document.createElement("img");
        img.setAttribute("src", url);
        const height = Number(img.naturalHeight);
        const width = Number(img.naturalWidth);
        return height >= minHeight && width >= minWidth;
      });
      setSrcs(filteredImageUrls);
    });
  };

  return (
    <>
      <button onClick={onClick}>Fetch Images</button>
      <div className="d-flex">
        Images above:
        <input
          type="number"
          placeholder="width"
          min="1"
          value={minWidth}
          onChange={e => setMinWidth(e.target.value || 5)}
        />
        <input
          type="number"
          placeholder="height"
          min="1"
          value={minHeight}
          onChange={e => setMinHeight(e.target.value || 5)}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
        className="multi-row-flex"
      >
        {srcs.map((src, i) => {
          return <img key={i} src={src} width={"33%"} height="auto" />;
        })}
      </div>
      {}
    </>
  );
}

export default OptionsHome;
