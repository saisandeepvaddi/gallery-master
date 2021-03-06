import React from "react";
import panzoom from "../../../libs/panzoom";
import { IconButton } from "evergreen-ui";
import debounce from "lodash.debounce";

const degrees = [0, 90, 180, 270];

function SlideShow({ images, stopSlideShow, currentIndex = 0 }) {
  const containerRef = React.useRef();
  const [imageToShow, setImageToShow] = React.useState(
    images && images.length > 0 ? images[currentIndex] : null
  );

  let currentAngleIndex = React.useRef(0);
  const imageRef = React.useRef();
  const indexRef = React.useRef(currentIndex);

  const rotate = React.useCallback(
    debounce((direction = "original") => {
      let nextIndex = 0;
      if (direction === "right") {
        const next = currentAngleIndex.current + 1;
        nextIndex = next > 3 ? 0 : next;
      } else if (direction === "left") {
        const next = currentAngleIndex.current - 1;
        nextIndex = next > -1 ? next : 3;
      } else if (direction === "original") {
        // original
        nextIndex = 0;
      }
      currentAngleIndex.current = nextIndex;
      let original = imageRef.current.style.transform;
      let t = original.replace(/rotate\(.*\)/gi, "");
      t = `${t} rotate(${degrees[nextIndex]}deg)`;
      imageRef.current.style.transform = t;
    }, 100),
    []
  );

  React.useEffect(() => {
    if (!imageRef.current) {
      console.log("No Ref");
    }

    const zoomInstance = panzoom(imageRef.current, {
      smoothScroll: false,
      zoomSpeed: 0.09,
      zoomDoubleClickSpeed: 1, //disable double click zoom,
      zoomOnUpDownArrow: true,
      filterKey: function(e) {
        if (e.which === 37 || e.which === 39) {
          return true;
        }
      },
      beforeWheel: function(e) {
        if (e.altKey) {
          e.stopPropagation();
          if (e.deltaY > 0) {
            //wheel down
            rotate("right");
          } else {
            rotate("left");
          }
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
      rotate("original");
      indexRef.current = indexRef.current - 1;
      setImageToShow(images[indexRef.current]);
    }
  };

  const showNext = () => {
    if (isValidIndex(indexRef.current + 1)) {
      rotate("original");
      indexRef.current = indexRef.current + 1;
      setImageToShow(images[indexRef.current]);
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
        <IconButton
          className="top-right"
          icon="cross"
          appearance="minimal"
          onClick={e => {
            e.stopPropagation();
            stopSlideShow();
          }}
          height={60}
        />

        <div
          className="slideshow-container d-flex justify-center align-center flex-column"
          // onClick={() => stopSlideShow()}
          onDoubleClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <img
            ref={imageRef}
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
            <IconButton
              onClick={handleClickLeft}
              disabled={indexRef.current === 0}
              icon="arrow-left"
              appearance="minimal"
              title="Show previous image"
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              height={60}
            />

            <IconButton
              icon="image-rotate-left"
              appearance="minimal"
              onClick={e => {
                e.stopPropagation();
                rotate("left");
              }}
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Rotate image left"
              height={60}
            />
            <span style={{ paddingRight: 30 }}></span>
            <IconButton
              icon="image-rotate-right"
              appearance="minimal"
              onClick={e => {
                e.stopPropagation();
                rotate("right");
              }}
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Rotate image right"
              height={60}
            />
            <IconButton
              onClick={handleClickRight}
              disabled={indexRef.current === images.length - 1}
              icon="arrow-right"
              appearance="minimal"
              title="Show next image"
              onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              height={60}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SlideShow;
