export const getDimensions = imgMeta => {
  return new Promise((resolve, reject) => {
    try {
      // If already has height and width (found in last load)
      const { height, width } = imgMeta;

      if (height && width) {
        resolve(imgMeta);
      }

      const img = new Image();
      img.onload = function() {
        const width = this.naturalWidth;
        const height = this.naturalHeight;
        resolve({
          ...imgMeta,
          width,
          height,
        });
      };

      img.src = imgMeta.src;
    } catch (error) {
      console.log("getDimensions error: ", error.message);
      reject(error);
    }
  });
};

const partialPromises = (promises, time, resolveWith) =>
  promises.map(userPromise => {
    return Promise.race([
      userPromise,
      new Promise(resolve => {
        const timer = setTimeout(() => {
          clearTimeout(timer);
          resolve(resolveWith);
        }, time);
        return timer;
      }),
    ]).catch(() => new Promise(resolve => resolve(resolveWith)));
  });

export const getPartialResults = async (
  promises,
  options = {
    time: 2000,
    resolveWith: 1,
    filter: true,
  }
) => {
  if (!Array.isArray(promises)) {
    throw new Error("getPartialResults: promises must be array of promises");
  }
  const time = options.time || 2000;
  const resolveWith = options.resolveWith || 1;
  const filter = options.filter ? true : false;
  const p = partialPromises(promises, time, resolveWith);
  const resolved = await Promise.all(p);
  let filteredResults = resolved;

  if (filter) {
    filteredResults = filteredResults.filter(r => r !== resolveWith);
  }

  return filteredResults;
};

export const getImagesWithMinDimensions = async ({
  imagesMeta,
  minHeight,
  minWidth,
  loadingTime,
}) => {
  const imgDimensions = imagesMeta.map(getDimensions);
  const imgsMetaWithDimensions = await getPartialResults(imgDimensions, {
    time: loadingTime || 5000,
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
