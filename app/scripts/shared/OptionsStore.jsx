import React from "react";
import { getDataFromStorage, setDataToStorage } from "./store";

const OptionsContext = React.createContext({});

const defaultOptions = {
  cols: 4,
};

function OptionsProvider(props) {
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    const getOptions = async () => {
      const allOptions = await getDataFromStorage(["options"]);
      if (!allOptions || !allOptions.options) {
        setDataToStorage({ options: defaultOptions });
        setOptions(defaultOptions);
      } else {
        setOptions(allOptions.options);
      }
    };

    getOptions();
  }, []);

  const setOption = React.useCallback(
    (key, value) => {
      if (!key || !value) {
        throw new Error("Invalid data passed to set option");
      }

      const updatedOptions = { ...options, [key]: value };

      setDataToStorage({ options: updatedOptions });
      setOptions(updatedOptions);
    },
    [options]
  );

  const value = React.useMemo(
    () => ({
      options,
      setOption,
    }),
    [options, setOption]
  );

  return <OptionsContext.Provider value={value} {...props} />;
}

const useOptions = () => {
  const context = React.useContext(OptionsContext);
  if (!context) {
    throw new Error("Options Provider must be used to use options context");
  }

  return context;
};

export { OptionsProvider, useOptions };
