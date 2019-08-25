import React from "react";
import panzoom from "panzoom";

function ZoomHome({ image, stopZoom }) {
  const { height, width, src } = image;
  const imageRef = React.createRef();

  React.useEffect(() => {
    if (!imageRef.current) {
      console.log("No Ref");
    }

    const zoomInstance = panzoom(imageRef.current, {
      smoothScroll: false,
      zoomSpeed: 0.09,
    });

    return () => {
      zoomInstance.dispose();
    };
  }, []);

  return (
    <>
      <div
        className="zoom-image-container d-flex justify-center align-center"
        onClick={() => stopZoom()}
      >
        <img
          ref={imageRef}
          src={src}
          style={{
            height,
            width,
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "scale-down",
            cursor: "grab",
          }}
          onClick={e => e.stopPropagation()}
        />
      </div>
    </>
  );
}

export default ZoomHome;
