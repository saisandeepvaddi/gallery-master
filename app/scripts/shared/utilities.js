const containerId = "imgextension-container";

export const injectContainer = () => {
  if (document.getElementById(containerId)) {
    return;
  }
  const el = document.createElement("div");
  el.id = containerId;

  document.body.appendChild(el);
};

export const getContainer = () => document.getElementById(containerId);

export const getDimensions = url => {
  return new Promise((res, rej) => {
    try {
      const img = new Image();
      img.onload = function() {
        const width = this.naturalWidth;
        const height = this.naturalHeight;
        res({
          url,
          width,
          height
        });
      };

      img.src = url;
    } catch (error) {
      console.log(`getDimensions error: `, error.message);
      rej(error);
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
      })
    ]).catch(e => new Promise(resolve => resolve(resolveWith)));
  });

export const getPartialResults = async (
  promises,
  options = {
    time: 2000,
    resolveWith: 1,
    filter: true
  }
) => {
  if (!Array.isArray(promises)) {
    throw new Error(`getPartialResults: promises must be array of promises`);
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
