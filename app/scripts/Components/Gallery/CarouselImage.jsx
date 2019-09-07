import React from "react";
import Carousel from "react-images";
import panzoom from "../../../libs/panzoom";
import debounce from "lodash.debounce";

const degrees = [0, 90, 180, 270];

function CarouselImage(props) {
  const {
    data: { src },
  } = props;

  let height = "100%";
  let width = "100%";
  // const { height, width, src } = image;
  const imageRef = React.useRef();
  const currentAngleIndex = React.useRef(0);

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

  return (
    <>
      <div
        className="zoom-image-container d-flex justify-center align-center"
        {...props.innerProps}
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

export default CarouselImage;
