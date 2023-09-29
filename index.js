function getPopUpElement(element) {
	return document.querySelector(element);
}

const btn = getPopUpElement(".btn");

btn.addEventListener("click", async () => {
	const res = await chrome.runtime.sendMessage({
		sayClicked: "css",
	});
	console.log("res: ", res);
});
