import React from "react";
import ReactDOM from "react-dom";
import { getImagesWithMinDimensions } from "../../shared/utilities";
import { Dialog, Pane } from "evergreen-ui";
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
  const [cols, setCols] = React.useState(5);
  const [loadingTime, setLoadingTime] = React.useState(1);
  const [minWidth, setMinWidth] = React.useState(300);
  // const [maxWidth, setMaxWidth] = React.useState(1000);
  const [minHeight, setMinHeight] = React.useState(300);
  // const [maxHeight, setMaxHeight] = React.useState(1000)

  React.useEffect(() => {}, []);

  const [loading, setLoading] = React.useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = React.useState(false);

  const hideContainer = () => {
    setShowGalleryDialog(false);
    ReactDOM.render(<React.Fragment />, getContainer());
  };

  const updateImages = async (imgs = []) => {
    if (!imgs || imgs.length === 0) {
      setLoading(false);
      setInitImagesMeta([]);
      setImagesMeta([]);
    }

    try {
      setLoading(true);
      const imagesMeta = imgs.map(img => ({ _id: uuid(), ...img }));

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

  const optionsBarProps = {
    loading,
    minWidth,
    minHeight,
    cols,
    setCols,
    loadingTime,
    setLoadingTime,
    setMinWidth,
    setMinHeight,
    updateImagesWithMinDimensions,
    imagesMeta,
  };

  return (
    <>
      <Dialog
        isShown={showGalleryDialog}
        title="Gallery"
        width="90vw"
        hasFooter={false}
        shouldCloseOnOverlayClick={false}
        onCloseComplete={() => hideContainer()}
      >
        <OptionsBar {...optionsBarProps} />
        {loading ? (
          <Info>Collecting Images...</Info>
        ) : (
          <Pane height="90vh">
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
                      <span key={_id} style={{ minHeight: 250 }}>
                        <Image imgMeta={imgMeta} />
                      </span>
                    );
                  })}
                </Grid>
              )}
            </>
          </Pane>
        )}
      </Dialog>
    </>
  );
}

export default Gallery;
