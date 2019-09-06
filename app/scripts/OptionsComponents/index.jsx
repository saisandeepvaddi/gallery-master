import React from "react";
import { useOptions, defaultOptions } from "../shared/OptionsStore";

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
      <p>Options</p>
      <div className="d-flex flex-column justify-center align-center">
        <div className="d-flex align-center">
          <label>
            Default Min Width:
            <input
              type="number"
              min="1"
              step="30"
              value={minWidth}
              onChange={handleWidthChange}
            />
          </label>
        </div>
        <div className="d-flex align-center">
          <label>
            Default Min Height:
            <input
              type="number"
              min="1"
              step="30"
              value={minHeight}
              onChange={handleHeightChange}
            />
          </label>
        </div>
        <div className="d-flex align-center">
          <label>
            Default Columns in Gallery:
            <input
              type="number"
              min="1"
              max="10"
              step="1"
              value={cols}
              onChange={handleColsChange}
            />
          </label>
        </div>
        <div className="d-flex align-center">
          <label>
            Maximum Loading time for Images:
            <input
              type="number"
              min="1"
              step="1"
              value={loadingTime || 1}
              onChange={handleLoadingTimeChange}
            />
          </label>
        </div>
      </div>
    </>
  );
}

export default OptionsPage;
