// 查找或创建 Gemini 标签页的函数
async function openOrFocusGeminiTab() {
  const geminiUrl = "https://gemini.google.com/";
  // 查找匹配的标签页
  const tabs = await chrome.tabs.query({ url: `${geminiUrl}*` });

  if (tabs.length > 0) {
    // 如果找到了，激活第一个匹配的标签页
    const existingTab = tabs[0];
    // 确保窗口是激活的
    await chrome.windows.update(existingTab.windowId, { focused: true });
    // 激活标签页
    await chrome.tabs.update(existingTab.id, { active: true });
  } else {
    // 如果没找到，创建新标签页
    chrome.tabs.create({ url: geminiUrl });
  }
}

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
        } catch (error) {
          // 如果现代API失败，尝试传统方法
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
      },
      args: [currentUrl],
    });

    // 打开或激活 Gemini 标签页
    await openOrFocusGeminiTab();

    // 显示成功通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Gemini 扩展",
      message: `已复制链接并打开或切换至 Gemini`,
    });
  } catch (error) {
    console.error("操作失败:", error);
    // 即使复制失败也要打开 Gemini 标签页
    await openOrFocusGeminiTab();

    // 显示通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Gemini 扩展",
      message: "已打开或切换至 Gemini（链接复制可能失败）",
    });
  }
});
