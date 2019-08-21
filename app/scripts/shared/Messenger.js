export const sendMessageToActiveTabContentScript = async message => {
  try {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      active: true
    });
    const tab = tabs.length ? tabs[0] : null;

    if (!tab) {
      throw new Error("No tabs active");
    }

    const response = await browser.tabs.sendMessage(tab.id, message);

    return response;
  } catch (error) {
    console.log(`sendMessageToActiveTab error: `, error);
    throw error;
  }
};
