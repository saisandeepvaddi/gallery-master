import React from "react";
import { Pane, TextInput, Button } from "evergreen-ui";

function OptionsBar({
  minWidth,
  minHeight,
  cols,
  setMinWidth,
  setMinHeight,
  updateImagesWithMinDimensions,
  setCols,
  loading,
  loadingTime,
  setLoadingTime,
}) {
  const updateImages = e => {
    e.preventDefault();
    updateImagesWithMinDimensions();
  };
  return (
    <>
      <Pane display="flex" padding={10} background="tint2">
        <Pane alignItems="center" display="flex">
          <span>Columns: </span>
          <TextInput
            type="number"
            placeholder="Columns in Grid"
            min="1"
            max="10"
            value={cols}
            onChange={e => setCols(e.target.value || 4)}
            width={100}
          />
        </Pane>
        <Pane style={{ margin: "0 auto" }} alignItems="center" display="flex">
          <form onSubmit={updateImages}>
            <span>Max Time: </span>
            <TextInput
              type="number"
              placeholder="width"
              min="1"
              step="30"
              value={loadingTime}
              onChange={e => setLoadingTime(e.target.value || 5)}
              width={100}
            />
            <span style={{ padding: 10 }}></span>
            <span>Min Width: </span>
            <TextInput
              type="number"
              placeholder="width"
              min="1"
              step="10"
              value={minWidth}
              onChange={e => setMinWidth(e.target.value || 5)}
              width={100}
            />
            <span style={{ padding: 10 }}></span>
            <span>Min Height: </span>
            <TextInput
              type="number"
              placeholder="height"
              min="1"
              step="10"
              value={minHeight}
              onChange={e => setMinHeight(e.target.value || 5)}
              width={100}
            />
            <span style={{ padding: 10 }}></span>

            <Button type="submit" onClick={updateImages} disabled={loading}>
              Update
            </Button>
          </form>
        </Pane>
      </Pane>
    </>
  );
}

export default OptionsBar;
