import React from "react";
import panzoom from "panzoom";
import { Button } from "evergreen-ui";

function SlideShow({ images, stopSlideShow, currentIndex = 0 }) {
  const containerRef = React.useRef();
  const [imageToShow, setImageToShow] = React.useState(
    images && images.length > 0 ? images[currentIndex] : null
  );
  const imagesRef = React.createRef();

  const indexRef = React.useRef(currentIndex);

  React.useEffect(() => {
    if (!imagesRef.current) {
      console.log("No Ref");
    }

    const zoomInstance = panzoom(imagesRef.current, {
      smoothScroll: false,
      zoomSpeed: 0.09,
      zoomDoubleClickSpeed: 1, //disable double click zoom
      filterKey: function(e) {
        if (e.which === 37 || e.which === 39) {
          return true;
        }
      },
    });

    return () => {
      zoomInstance.dispose();
    };
  }, []);

  const isValidIndex = index => {
    return index >= 0 && index < images.length;
  };

  const showPrevious = () => {
    if (isValidIndex(indexRef.current - 1)) {
      indexRef.current = indexRef.current - 1;
      setImageToShow(images[indexRef.current]);
    }
  };

  const showNext = () => {
    if (isValidIndex(indexRef.current + 1)) {
      indexRef.current = indexRef.current + 1;
      setImageToShow(images[indexRef.current]);
    }
  };

  const handleKeyboard = key => {
    console.log("key:", key);
    if (key === 37) {
      showPrevious();
    } else if (key === 39) {
      showNext();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", e => {
      e.stopPropagation();

      handleKeyboard(e.which);
    });
  }, []);

  const handleClickLeft = e => {
    e.preventDefault();
    e.stopPropagation();
    showPrevious();
  };

  const handleClickRight = e => {
    e.preventDefault();
    e.stopPropagation();
    showNext();
  };

  return (
    <>
      <div ref={containerRef}>
        <Button
          className="top-right"
          iconBefore="cross"
          onClick={e => {
            e.stopPropagation();
            stopSlideShow();
          }}
        >
          Close
        </Button>
        <div
          className="slideshow-container d-flex justify-center align-center flex-column"
          // onClick={() => stopSlideShow()}
          onDoubleClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
          <div
            className="d-flex align-center justify-center w-100"
            style={{ zIndex: 99999, marginTop: "auto", marginBottom: 10 }}
          >
            <Button
              onClick={handleClickLeft}
              disabled={indexRef.current === 0}
              iconBefore="arrow-left"
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Previous
            </Button>
            <Button
              onClick={handleClickRight}
              disabled={indexRef.current === images.length - 1}
              iconAfter="arrow-right"
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SlideShow;
