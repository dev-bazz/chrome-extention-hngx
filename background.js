// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.action.setBadgeText({
// 		text: "OFF",
// 	});
// });

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			async (tabs) => {
				const activeTab = tabs[0];
				if (request.sayClicked === "clicked") {
					chrome.action.setBadgeText({
						text: "Online",
					});
					sendResponse("Okay");
				} else if (request.sayClicked === "css") {
					await chrome.scripting.insertCSS({
						files: ["./styles/player.css"],
						target: { tabId: activeTab.id },
					});
					console.log("done");
					sendResponse("My CSS");
				}
			},
		);
	},
);
