import React from "react";
import panzoom from "../../../libs/panzoom";
import { Button } from "evergreen-ui";

function SlideShow({ images, stopSlideShow, currentIndex = 0 }) {
  const containerRef = React.useRef();
  const [imageToShow, setImageToShow] = React.useState(
    images && images.length > 0 ? images[currentIndex] : null
  );

  const angle = React.useRef(0);

  const imagesRef = React.useRef();
  const indexRef = React.useRef(currentIndex);

  const rotate = React.useCallback(e => {
    const currentAngle = Number.isNaN(angle.current) ? 0 : angle.current;
    let newAngle = currentAngle;
    if (e.deltaY > 0) {
      // Wheel Down
      newAngle = (currentAngle + 90) % 360;
    } else {
      // wheel Up
      newAngle = (currentAngle - 90) % 360;
    }
    imagesRef.current.style.transformOrigin = "center";
    imagesRef.current.style.transform = `rotate(${newAngle}deg)`;
    angle.current = newAngle;
  }, []);

  const setupZoom = React.useCallback(() => {
    console.log("Angle now; ", angle.current);

    const zoomInstance = panzoom(imagesRef.current, {
      smoothScroll: false,
      zoomSpeed: 0.09,
      zoomDoubleClickSpeed: 1, //disable double click zoom,
      zoomOnUpDownArrow: true,
      beforeWheel: function(e) {
        const shouldIgnore = e.altKey;

        if (shouldIgnore) {
          rotate(e);
        }

        return shouldIgnore;
      },
      filterKey: function(e) {
        if (e.which === 37 || e.which === 39) {
          return true;
        }
      },
    });

    zoomInstance.on("zoom", function(e) {
      e.pause();
      imagesRef.current.style.transformOrigin = "center";
      imagesRef.current.style.transform = `rotate(${angle.current}deg)`;
      e.resume();
    });

    return () => {
      zoomInstance.dispose();
    };
  }, [angle]);

  React.useEffect(() => {
    if (!imagesRef.current) {
      console.log("No Ref");
    }

    setupZoom();
  }, []);

  const isValidIndex = index => {
    return index >= 0 && index < images.length;
  };

  const showPrevious = () => {
    if (isValidIndex(indexRef.current - 1)) {
      indexRef.current = indexRef.current - 1;
      setImageToShow(images[indexRef.current]);
      angle.current = 0;
    }
  };

  const showNext = () => {
    if (isValidIndex(indexRef.current + 1)) {
      indexRef.current = indexRef.current + 1;
      setImageToShow(images[indexRef.current]);
      angle.current = 0;
    }
  };

  const handleKeyboard = key => {
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
            id="someRandomId"
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
            <span style={{ paddingRight: 10 }}></span>
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
