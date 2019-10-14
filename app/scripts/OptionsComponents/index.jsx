import React from "react";
import { useOptions, defaultOptions } from "../shared/OptionsStore";
import { TextInput } from "evergreen-ui/commonjs/text-input";

function OptionsPage() {
  const { options, setOption } = useOptions();
  let initialOptions = options || { ...defaultOptions };

  const [minWidth, setMinWidth] = React.useState(initialOptions.minWidth);

  const [minHeight, setMinHeight] = React.useState(initialOptions.minHeight);

  const [cols, setCols] = React.useState(initialOptions.cols);
  const [loadingTime, setLoadingTime] = React.useState(
    initialOptions.loadingTime
  );

  React.useEffect(() => {
    if (!options) {
      return;
    }

    setMinWidth(options.minWidth);
    setMinHeight(options.minHeight);
    setCols(options.cols);
    setLoadingTime(options.loadingTime);
  }, [options]);

  const handleWidthChange = e => {
    const width = Number(e.target.value);
    setMinWidth(width);
    setOption("minWidth", width);
  };

  const handleHeightChange = e => {
    const height = Number(e.target.value);
    setMinHeight(height);
    setOption("minHeight", height);
  };

  const handleColsChange = e => {
    const cols = Number(e.target.value);
    setCols(cols);
    setOption("cols", cols);
  };

  const handleLoadingTimeChange = e => {
    const time = Number(e.target.value);
    setCols(time);
    setOption("loadingTime", time);
  };

  if (!options) {
    return <div>Loading Options....</div>;
  }

  return (
    <>
      <div className="d-flex justify-center">
        <h1>Gallery Master Options</h1>
      </div>
      <div className="d-flex flex-column justify-center">
        <div className="w-100 d-flex align-center">
          <label htmlFor="min-width" className="flex-1 text-right">
            Default Min Width:
          </label>
          <span className="flex-1 text-left ml-2">
            <TextInput
              type="number"
              id="min-width"
              min="1"
              step="30"
              style={{ width: 200 }}
              value={minWidth}
              onChange={handleWidthChange}
            />
          </span>
        </div>
        <p className="d-flex justify-center mb-2">
          Default minimum width of images to collect.
        </p>
        <div className="w-100 d-flex align-center">
          <label htmlFor="min-height" className="flex-1 text-right">
            Default Min Height:
          </label>
          <span className="flex-1 text-left ml-2">
            <TextInput
              type="number"
              id="min-height"
              min="1"
              step="30"
              style={{ width: 200 }}
              value={minHeight}
              onChange={handleHeightChange}
            />
          </span>
        </div>
        <p className="d-flex justify-center mb-2">
          Default minimum height of images to collect.
        </p>

        <div className="w-100 d-flex align-center">
          <label htmlFor="columns" className="flex-1 text-right">
            Default Columns in Gallery:
          </label>
          <span className="flex-1 text-left ml-2">
            <TextInput
              type="number"
              min="1"
              id="columns"
              max="10"
              step="1"
              style={{ width: 200 }}
              value={cols}
              onChange={handleColsChange}
            />
          </span>
        </div>
        <p className="d-flex justify-center mb-2">
          Default number of columns in images grid.
        </p>

        <div className="w-100 d-flex align-center mb-2">
          <label htmlFor="loading-time" className="flex-1 text-right">
            Default maximum loading time for images:
          </label>
          <span className="flex-1 text-left ml-2">
            <TextInput
              type="number"
              id="loading-time"
              min="1"
              step="1"
              style={{ width: 200 }}
              value={loadingTime || 1}
              onChange={handleLoadingTimeChange}
            />
            &nbsp;seconds.
          </span>
        </div>
        <p className="d-flex justify-center mb-2">
          Default maximum number of minutes to spend to collect images. Longer
          time might result in collecting more images if the page contains large
          number of images.
        </p>
      </div>
    </>
  );
}

export default OptionsPage;
