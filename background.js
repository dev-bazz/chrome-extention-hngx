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

				try {
					if (request.sayClicked === "clicked") {
						chrome.action.setBadgeText({
							text: "Online",
						});
						sendResponse("Okay");
					} else if (request.sayClicked === "content") {
						await chrome.scripting.insertCSS({
							files: ["./styles/player.css"],
							target: { tabId: activeTab.id },
						});
						chrome.scripting.executeScript({
							target: { tabId: activeTab.id },
							func: startCapture,
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
		);
	},
);

// -------------justifyContent:

async function startCapture(displayMediaOptions) {
	// Timer
	let startTime = 0;
	let paused = true;
	let elapsedTime = 0;
	let timerId = null;
	const timerElement = document.getElementById("timer");

	function startTimer() {
		if (paused) {
			startTime = Date.now() - elapsedTime;
			paused = false;
			updateTime();
		}
	}

	function pauseTimer() {
		if (!paused) {
			cancelAnimationFrame(timerId);
			paused = true;
		}
	}

	function resetTimer() {
		startTime = 0;
		elapsedTime = 0;
		updateTime();
	}

	function updateTime() {
		const currentTime = Date.now();
		elapsedTime = currentTime - startTime;
		const minutes = Math.floor(elapsedTime / 60000);
		const seconds = Math.floor((elapsedTime % 60000) / 1000);
		timerElement.textContent = `${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

		if (!paused) {
			timerId = requestAnimationFrame(updateTime);
		}
	}

	let mediaRecorder,
		recordedBlobs = [],
		chunkSize = 224 * 224;
	// DOM Creation
	async function createDOM(stream) {
		// <video style="height: 100%; width: 100%; " src="${
		// 	stream.getVideoTracks()[0]
		// }"></video>

		const recorder = new MediaRecorder(stream);

		recorder.start();
		recorder.addEventListener("dataavailable", (event) => {
			const dataBlob = event.data;
			const totalSize = dataBlob.size;
			let start = 0;

			while (start < totalSize) {
				const end = Math.min(start + chunkSize, totalSize);
				const chunkBlob = dataBlob.slice(start, end);
				recordedBlobs.push(chunkBlob);
				start = end;
				console.log(recordedBlobs);
			}
			console.log(recordedBlobs);
		});

		console.log(stream, "Stream");
		const navUI = `<div class="webCam">

		</div>
	<div class="ctrl">
		<div style="align-self: normal; display: grid; place-items: center; border-right: 2px solid white; padding-inline: 24px;">
			<p
				class="timer"
				id="timer"
				style="
					color: #fff;
					font-family: Inter;
					font-size: 20px;
					font-style: normal;
					font-weight: 500;
					line-height: normal;
				"
				>00:00:00</p
			>
		</div>
		<div className="ctrlButtons" style="display: flex; gap: 20px;">

			</div>

		</div>
	</div>
	`;

		const controls = `	<div className="btnCtrl" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; justify-content: space-between;">

		<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white"/>
			<path d="M18 16.5L18 27.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
			<path d="M26 16.5L26 27.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
			<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="white"/>
			</svg>

		<p>Pause</p>
	</div>
	<div id="stopBTN"  className="btnCtrl stopBTN " style="display: flex; flex-direction: column; align-items: center; cursor: pointer; justify-content: space-between;" >

	</div>
	<div className="btnCtrl" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
		<svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white"/>
			<path d="M25.75 20.5L30.4697 15.7803C30.9421 15.3079 31.75 15.6425 31.75 16.3107V27.6893C31.75 28.3575 30.9421 28.6921 30.4697 28.2197L25.75 23.5M14.5 28.75H23.5C24.7426 28.75 25.75 27.7426 25.75 26.5V17.5C25.75 16.2574 24.7426 15.25 23.5 15.25H14.5C13.2574 15.25 12.25 16.2574 12.25 17.5V26.5C12.25 27.7426 13.2574 28.75 14.5 28.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<g filter="url(#filter0_d_597_1360)">
			<rect x="32" y="34" width="12" height="12" rx="2" fill="white"/>
			<path d="M40.6399 41.0167L38.4665 38.8434C38.2099 38.5867 37.7899 38.5867 37.5332 38.8434L35.3599 41.0167" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
			</g>
			<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="black"/>
			<defs>
			<filter id="filter0_d_597_1360" x="28" y="34" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
			<feFlood flood-opacity="0" result="BackgroundImageFix"/>
			<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
			<feOffset dy="4"/>
			<feGaussianBlur stdDeviation="2"/>
			<feComposite in2="hardAlpha" operator="out"/>
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_597_1360"/>
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_597_1360" result="shape"/>
			</filter>
			</defs>
			</svg>
			<p style="margin-top: 0.2em;">Camera</p>
		</div>
		<div className="btnCtrl" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
			<svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white"/>
				<path d="M22 28.75C25.3137 28.75 28 26.0637 28 22.75V21.25M22 28.75C18.6863 28.75 16 26.0637 16 22.75V21.25M22 28.75V32.5M18.25 32.5H25.75M22 25.75C20.3431 25.75 19 24.4069 19 22.75V14.5C19 12.8431 20.3431 11.5 22 11.5C23.6569 11.5 25 12.8431 25 14.5V22.75C25 24.4069 23.6569 25.75 22 25.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<g filter="url(#filter0_d_597_1366)">
				<rect x="32" y="34" width="12" height="12" rx="2" fill="white"/>
				<path d="M40.6399 41.0167L38.4665 38.8434C38.2099 38.5867 37.7899 38.5867 37.5332 38.8434L35.3599 41.0167" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
				</g>
				<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="black"/>
				<defs>
				<filter id="filter0_d_597_1366" x="28" y="34" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
				<feFlood flood-opacity="0" result="BackgroundImageFix"/>
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
				<feOffset dy="4"/>
				<feGaussianBlur stdDeviation="2"/>
				<feComposite in2="hardAlpha" operator="out"/>
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_597_1366"/>
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_597_1366" result="shape"/>
				</filter>
				</defs>
				</svg>

			<p style="margin-top: 0.2em;">Mic</p>
		</div>

		<div class="trash" style="cursor: pointer;">
			<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="#4B4B4B"/>
				<path d="M24.7404 19L24.3942 28M19.6058 28L19.2596 19M29.2276 15.7906C29.5696 15.8422 29.9104 15.8975 30.25 15.9563M29.2276 15.7906L28.1598 29.6726C28.0696 30.8448 27.0921 31.75 25.9164 31.75H18.0836C16.9079 31.75 15.9304 30.8448 15.8402 29.6726L14.7724 15.7906M29.2276 15.7906C28.0812 15.6174 26.9215 15.4849 25.75 15.3943M13.75 15.9563C14.0896 15.8975 14.4304 15.8422 14.7724 15.7906M14.7724 15.7906C15.9188 15.6174 17.0785 15.4849 18.25 15.3943M25.75 15.3943V14.4782C25.75 13.2988 24.8393 12.3142 23.6606 12.2765C23.1092 12.2589 22.5556 12.25 22 12.25C21.4444 12.25 20.8908 12.2589 20.3394 12.2765C19.1607 12.3142 18.25 13.2988 18.25 14.4782V15.3943M25.75 15.3943C24.5126 15.2987 23.262 15.25 22 15.25C20.738 15.25 19.4874 15.2987 18.25 15.3943" stroke="#BEBEBE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="black"/>
				</svg>

		</div>`;

		const injectElement = document.createElement("div");
		injectElement.className = "playerBazz";
		injectElement.style.position = "fixed";
		injectElement.style.top = "74vh";
		injectElement.style.left = "3vw";
		injectElement.style.maxWidth = "768px";
		injectElement.style.zIndex = "9999";
		injectElement.innerHTML = navUI;
		const styleBTN = {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			cursor: "pointer",
			justifyContent: "space-between",
			color: "#fff",
		};
		window.stream = stream;

		const video = document.createElement("video");
		video.setAttribute("playsinline", true);
		video.addEventListener("click", () => console.log(video));

		injectElement.querySelector(".webCam").appendChild(video);
		// video.srcObject = stream;

		const stop = document.createElement("div");
		stop.className = "btnCtrl stopBTN";

		stop.innerHTML = `	<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white"/>
		<path d="M15.25 17.5C15.25 16.2574 16.2574 15.25 17.5 15.25H26.5C27.7426 15.25 28.75 16.2574 28.75 17.5V26.5C28.75 27.7426 27.7426 28.75 26.5 28.75H17.5C16.2574 28.75 15.25 27.7426 15.25 26.5V17.5Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="black"/>
		</svg>

	<p >Stop</p>`;
		Object.assign(stop.style, styleBTN);
		stop.addEventListener("click", () => {
			recorder.pause();
			console.log("STOOP");
		});

		const controlBTNs = document.createElement("div");
		const styleControls = {
			display: "flex",
			gap: "20px",
		};
		controlBTNs.className = ".ctrlButtons";
		Object.assign(controlBTNs.style, styleControls);
		controlBTNs.innerHTML = controls;
		console.log(stop);
		controlBTNs.appendChild(stop);
		injectElement
			.querySelector(".ctrl")
			.appendChild(controlBTNs);

		// injectElement
		// 	.querySelector(".ctrl .ctrlButtons")
		// 	?.appendChild(stop);

		// ------------------------->

		document.body.appendChild(injectElement);
	}

	const gdmOptions = {
		video: {
			displaySurface: "window",
			// Use "user" for the front camera
		},
		audio: true, // Set audio to false to disable audio capture
		// surfaceSwitching: "include",
		selfBrowserSurface: "exclude",
		systemAudio: "exclude",
	};

	const userConstraint = {
		audio: true,
		video: {
			width: 1200,
			height: 720,
		},
	};

	try {
		const stream = await navigator.mediaDevices.getDisplayMedia(
			gdmOptions,
		);
		console.log(stream, "pass stream");
		createDOM(stream);
	} catch (err) {
		console.error(`Error: ${err}`);
	}
	return captureStream;
}
