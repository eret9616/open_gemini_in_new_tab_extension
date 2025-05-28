chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://gemini.google.com/" });
});
