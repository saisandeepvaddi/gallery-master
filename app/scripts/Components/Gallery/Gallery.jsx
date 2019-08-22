import React from "react";
import ReactDOM from "react-dom";
import { getDimensions, getPartialResults } from "../../shared/utilities";
import { Dialog } from "evergreen-ui";
import { getContainer } from "../../contentScripts/page";
import Image from "./Image";
import Grid from "./Grid";
import OptionsBar from "./OptionsBar";
import uuid from "uuid/v4";
import "lazysizes";

const getImagesWithMinDimensions = async ({
  imagesMeta,
  minHeight,
  minWidth,
}) => {
  console.log("imagesMeta:", imagesMeta);
  const imgDimensions = imagesMeta.map(getDimensions);
  const imgsMetaWithDimensions = await getPartialResults(imgDimensions, {
    time: 1000,
    filter: true,
  });

  const filteredImagesMeta = imgsMetaWithDimensions.filter(meta => {
    const { height, width } = meta;
    if (!height || !width) {
      return false;
    }
    return height >= minHeight && width >= minWidth;
  });

  return filteredImagesMeta;
};

function Gallery({ images }) {
  const [initImagesMeta, setInitImagesMeta] = React.useState([]);
  const [imagesMeta, setImagesMeta] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [minWidth, setMinWidth] = React.useState(500);
  // const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(500);
  // const [maxHeight, setMaxHeight] = React.useState<OptionsBa

  const [loading, setLoading] = React.useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = React.useState(false);

  const hideContainer = () => {
    setShowGalleryDialog(false);
    ReactDOM.render(<React.Fragment />, getContainer());
  };

  const updateImages = async (urls = []) => {
    if (!urls || urls.length === 0) {
      setLoading(false);
      setImagesMeta([]);
    }
    try {
      setLoading(true);
      const imagesMeta = urls.map(url => ({ _id: uuid(), src: url }));

      setLoading(false);
      setImagesMeta(imagesMeta);
      setInitImagesMeta(imagesMeta);
    } catch (error) {
      console.error(error.message);
      setImagesMeta([]);
      setLoading(false);
    }
  };

  const updateImagesWithMinDimensions = async () => {
    try {
      setLoading(true);
      const updatedMeta = await getImagesWithMinDimensions({
        imagesMeta: initImagesMeta,
        minHeight,
        minWidth,
      });
      console.log("updatedMeta:", updatedMeta);
      setLoading(false);
      setImagesMeta(updatedMeta);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setImagesMeta([]);
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
        <OptionsBar
          minWidth={minWidth}
          minHeight={minHeight}
          cols={cols}
          setCols={setCols}
          setMinWidth={setMinWidth}
          setMinHeight={setMinHeight}
          updateImagesWithMinDimensions={updateImagesWithMinDimensions}
        />
        {loading ? (
          "Loading"
        ) : (
          <Grid cols={cols}>
            {!imagesMeta || imagesMeta.length === 0 ? (
              <span>No Images</span>
            ) : (
              imagesMeta.map((imgMeta, i) => {
                const { src, _id } = imgMeta;
                return (
                  <span key={i}>
                    <Image _id={_id} src={src} />
                  </span>
                );
              })
            )}
          </Grid>
        )}
      </Dialog>
    </>
  );
}

export default Gallery;
