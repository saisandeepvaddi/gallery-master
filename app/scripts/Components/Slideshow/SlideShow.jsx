import React from "react";
import panzoom from "panzoom";

function SlideShow({ images, stopSlideShow, currentIndex = 0 }) {
  const [imageToShow, setImageToShow] = React.useState(
    images && images.length > 0 ? images[currentIndex] : null
  );
  const imagesRef = React.createRef();

  const [imageIndex, setImageIndex] = React.useState(currentIndex);

  React.useEffect(() => {
    if (!imagesRef.current) {
      console.log("No Ref");
    }

    const zoomInstance = panzoom(imagesRef.current, {
      smoothScroll: false,
      zoomSpeed: 0.09,
    });

    return () => {
      zoomInstance.dispose();
    };
  }, []);

  const isValidIndex = index => {
    return index > 0 && index < images.length;
  };

  React.useEffect(() => {
    if (!isValidIndex(imageIndex)) {
      return;
    }
    console.log("images:", images);
    console.log("imageIndex:", imageIndex);
    setImageToShow(images[imageIndex]);
  }, [imageIndex]);

  const handleClickLeft = e => {
    e.preventDefault();
    e.stopPropagation();
    if (isValidIndex(imageIndex - 1)) {
      setImageIndex(imageIndex - 1);
    }
  };

  const handleClickRight = e => {
    e.preventDefault();
    e.stopPropagation();
    if (isValidIndex(imageIndex + 1)) {
      setImageIndex(imageIndex + 1);
    }
  };

  return (
    <>
      <div
        className="slideshow-container d-flex justify-center align-center flex-column"
        onClick={() => stopSlideShow()}
      >
        <img
          ref={imagesRef}
          src={imageToShow.src}
          style={{
            height: imageToShow.height,
            width: imageToShow.width,
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "scale-down",
            cursor: "grab",
          }}
          onClick={e => e.stopPropagation()}
        />
        <div className="d-flex align-center justify-center w-100">
          <button onClick={handleClickLeft}>Left</button>
          <button onClick={handleClickRight}>Right</button>
        </div>
      </div>
    </>
  );
}

export default SlideShow;
