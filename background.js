chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 获取当前活动标签页的URL
    const currentUrl = tab.url;

    // 通过content script复制URL到剪切板
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (url) => {
        try {
          await navigator.clipboard.writeText(url);
          return { success: true };
        } catch (error) {
          // 如果现代API失败，尝试传统方法
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          return { success: true };
        }
      },
      args: [currentUrl],
    });

    // 打开新的 Gemini 标签页
    chrome.tabs.create({ url: "https://gemini.google.com/" });

    // 显示成功通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Gemini 扩展",
      message: `已复制链接并打开 Gemini`,
    });
  } catch (error) {
    console.error("操作失败:", error);
    // 即使复制失败也要打开 Gemini 标签页
    chrome.tabs.create({ url: "https://gemini.google.com/" });

    // 显示通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Gemini 扩展",
      message: "已打开 Gemini（链接复制可能失败）",
    });
  }
});
