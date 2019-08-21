import React from "react";
import ReactDOM from "react-dom";
import {
  getContainer,
  getDimensions,
  getPartialResults
} from "../shared/utilities";
import { Button, Dialog } from "evergreen-ui";

function Gallery({ images }) {
  const [srcs, setSrcs] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [minWidth, setMinWidth] = React.useState(100);
  const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(100);
  const [maxHeight, setMaxHeight] = React.useState(100);
  const [loading, setLoading] = React.useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = React.useState(false);

  const hideContainer = () => {
    setShowGalleryDialog(false);
    ReactDOM.render(<React.Fragment />, getContainer());
  };

  React.useEffect(() => {
    console.log("srcs:", srcs);
  }, [srcs]);

  const updateImages = async urls => {
    try {
      setLoading(true);
      const imgDimensions = urls.map(getDimensions);
      const imgMeta = await getPartialResults(imgDimensions, {
        time: 5000,
        filter: true
      });
      const filteredImageUrls = imgMeta
        .filter(meta => {
          const { height, width } = meta;
          if (!height || !width) {
            return false;
          }
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

  React.useEffect(() => {
    setShowGalleryDialog(true);
  }, []);

  React.useEffect(() => {
    updateImages(images || []);
  }, [images]);

  return (
    <>
      <Dialog
        isShown={showGalleryDialog}
        title="Gallery"
        width="80vw"
        hasFooter={false}
        onCloseComplete={() => hideContainer()}
      >
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
        {loading ? "Loading" : ""}
        <div
          style={{
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
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%"
                  }}
                />
              </span>
            );
          })}
        </div>
      </Dialog>
    </>
  );
}

export default Gallery;
