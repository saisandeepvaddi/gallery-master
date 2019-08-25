export const getDataFromStorage = async keys => {
  if (!keys || keys.length === 0) {
    console.log("Returning all settings");
    return await browser.storage.sync.get();
  }

  const data = await browser.storage.sync.get([...keys]);

  return data;
};

export const setDataToStorage = async data => {
  await browser.storage.sync.set({ ...data });
  return true;
};
