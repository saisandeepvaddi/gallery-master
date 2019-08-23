import React from "react";
import ReactDOM from "react-dom";
import { getImagesWithMinDimensions } from "../../shared/utilities";
import { Dialog } from "evergreen-ui";
import { getContainer } from "../../contentScripts/page";
import Image from "./Image";
import Grid from "./Grid";
import OptionsBar from "./OptionsBar";
import uuid from "uuid/v4";
import "lazysizes";
import Info from "./Info";
import { useImages } from "../../shared/ImageStore";

function Gallery() {
  const { images } = useImages();
  const [initImagesMeta, setInitImagesMeta] = React.useState([]);
  const [imagesMeta, setImagesMeta] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [loadingTime, setLoadingTime] = React.useState(5);
  const [minWidth, setMinWidth] = React.useState(500);
  // const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(500);
  // const [maxHeight, setMaxHeight] = React.useState(100)

  const [loading, setLoading] = React.useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = React.useState(false);

  const hideContainer = () => {
    setShowGalleryDialog(false);
    ReactDOM.render(<React.Fragment />, getContainer());
  };

  const updateImages = async (urls = []) => {
    if (!urls || urls.length === 0) {
      setLoading(false);
      setInitImagesMeta([]);
      setImagesMeta([]);
    }

    try {
      setLoading(true);
      const imagesMeta = urls.map(url => ({ _id: uuid(), src: url }));

      // Get images only with min width, height
      const updatedMeta = await getImagesWithMinDimensions({
        loadingTime: Number(loadingTime) * 1000,
        imagesMeta,
        minHeight,
        minWidth,
      });

      setLoading(false);
      setImagesMeta(updatedMeta);
      const updatedMetaIdsMap = {};
      updatedMeta.forEach(x => {
        updatedMetaIdsMap[x._id] = x;
      });
      const allImagesMetaWithDimentions = imagesMeta.map(img => {
        const existingImg = updatedMetaIdsMap[img._id];
        return existingImg ? existingImg : img;
      });

      // Contains all images details

      setInitImagesMeta(allImagesMetaWithDimentions);
    } catch (error) {
      console.error(error.message);
      setImagesMeta([]);
      setInitImagesMeta([]);
      setLoading(false);
    }
  };

  const updateImagesWithMinDimensions = async () => {
    try {
      setLoading(true);
      const updatedMeta = await getImagesWithMinDimensions({
        loadingTime: Number(loadingTime) * 1000,
        imagesMeta: initImagesMeta,
        minHeight,
        minWidth,
      });
      setLoading(false);
      console.log("updatedMeta after change:", updatedMeta);
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
        shouldCloseOnOverlayClick={false}
        onCloseComplete={() => hideContainer()}
      >
        <OptionsBar
          loading={loading}
          minWidth={minWidth}
          minHeight={minHeight}
          cols={cols}
          setCols={setCols}
          loadingTime={loadingTime}
          setLoadingTime={setLoadingTime}
          setMinWidth={setMinWidth}
          setMinHeight={setMinHeight}
          updateImagesWithMinDimensions={updateImagesWithMinDimensions}
          imagesMeta={imagesMeta}
        />
        {loading ? (
          <Info>Loading...</Info>
        ) : (
          <>
            {!imagesMeta || imagesMeta.length === 0 ? (
              <Info>
                No Images found with selected dimensions. Try decreasing Min
                Width and Min Height.
              </Info>
            ) : (
              <Grid cols={cols}>
                {imagesMeta.map(imgMeta => {
                  const { _id } = imgMeta;
                  return (
                    <span key={_id}>
                      <Image imgMeta={imgMeta} />
                    </span>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}

export default Gallery;
