function getElement(element) {
	return document.querySelector(element);
}

function createDOM() {
	const injectElement = document.createElement("div");
	injectElement.className = "player";
	injectElement.innerHTML = `
  <div>
  <h2>Hello World</h2>
  </div>
  <div>
  <p>Nice to meet you</p>
  </div>
  `;

	document.body.appendChild(injectElement);
}

createDOM();
