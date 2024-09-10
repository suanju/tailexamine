export default defineBackground(() => {
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id!, { toggle: true });
  });
});
