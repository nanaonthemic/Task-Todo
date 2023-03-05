const addNewTodoModal = document.querySelector("#new-task-modal");
const openNewTodoModal = document.querySelector(".open-new-task-modal");
const closeNewTodoModal = document.querySelector(".close-new-task-modal");
const newTodoSubmit = document.querySelector("#new-task-submit");

const editTodoModal = document.querySelector("#edit-task-modal");
const openEditTodoModals = document.querySelectorAll(".open-edit-task-modal");
const closeEditTodoModals = document.querySelectorAll(".close-edit-task-modal");
const deleteTodoCards = document.querySelectorAll(".delete-task");
const submitEditModal = document.querySelector("#edit-task-submit");

const todoLane = document.querySelector("#todo-lane");
const doingLane = document.querySelector("#doing-lane");
const finishedLane = document.querySelector("#finished-lane");

const cards = document.querySelectorAll(".card");
const allSwimlanes = document.querySelectorAll(".swim-lane");

const newCategory = document.querySelector("#new-category");
const newTitle = document.querySelector("#new-title");
const newContent = document.querySelector("#new-content");

const renderLane = (laneName) => {
	const lane = document.querySelector(`#${laneName}-lane`);

	const data = JSON.parse(localStorage.getItem(laneName) || "[]");
	data.map(({ id, category, title, content, createAt }) => {
		const htmlContent = `
    <div id="${id}" class="card" draggable="true" lane="todo" ondragstart="dragStart(event)" ondragend="dragEnd(event)">
        <div class="card-header">
            <h3 class="heading-tertiary" data="category">${category}</h3>
            <div>
                <a class="open-edit-task-modal"><img src="image/icon-edit.png" src="Edit" onclick="handleEditButtonClicked('${id}')"></a>
                <a class="delete-task"><img src="image/icon-delete.png" src="Delete" onclick="handleDeleteButtonClicked('${id}')"></a>
            </div>
        </div>
        <div class="card-content">
            <h1 class="heading-primary" data="title">${title}</h1>
        </div>
        <div class="line-space"></div>
        <div class="card-footer">
            <p class="subheading" data="content">${content}</p>
            <div class="card-time">
                <img src="image/icon-clock.png">
                <p data="createAt">${createAt}</p>
            </div>
        </div>
    </div>
        `;

		lane.innerHTML += htmlContent;
	});

	setTimeout(() => {
		updateLaneSize(laneName);
	}, 0);
};

renderLane("todo");
renderLane("doing");
renderLane("finished");

// NEW TASK MODAL
// openNewTodoModals.forEach((openNewTodoModal) => {
openNewTodoModal.addEventListener("click", function () {
	// document.querySelector(openNewTodoModal.dataset.target).add("active");
	addNewTodoModal.style.display = "block";
});
// });

// closeNewTodoModals.forEach((closeNewTodoModal) => {
closeNewTodoModal.addEventListener("click", function () {
	// document.querySelector(openNewTodoModal.dataset.target).add("active");
	addNewTodoModal.style.display = "none";
});
// });

// EDIT TASK MODAL

openEditTodoModals.forEach((openEditTodoModal) => {
	openEditTodoModal.addEventListener("click", function () {
		editTodoModal.style.display = "block";
	});
});

closeEditTodoModals.forEach((closeEditTodoModal) => {
	closeEditTodoModal.addEventListener("click", function () {
		editTodoModal.style.display = "none";
	});
});

window.addEventListener("click", function (e) {
	if (e.target == addNewTodoModal) {
		addNewTodoModal.style.display = "none";
	}
});

window.addEventListener("click", function (e) {
	if (e.target == editTodoModal) {
		editTodoModal.style.display = "none";
	}
});

// DRAG AND DROP
let draggableTodo = null;
cards.forEach((card) => {
	card.addEventListener("dragstart", dragStart);
	card.addEventListener("dragend", dragEnd);
});

function dragStart(event) {
	// console.log(event);
	setTimeout(() => {
		event.target.style.display = "none";
	}, 0);

	event.dataTransfer.setData("cardId", event.target.id);
}

function dragEnd(event) {
	console.log(event);
	draggableTodo = null;
	setTimeout(() => {
		event.target.style.display = "block";
	}, 0);
	// console.log("dragEnd");
}

allSwimlanes.forEach((swimlane) => {
	swimlane.addEventListener("dragover", dragOver);
	// swimlane.addEventListener("dragenter", dragEnter);
	// swimlane.addEventListener("dragleave", dragLeave);
	// swimlane.addEventListener("drop", dragDrop);
});

function allowDrop(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	const cardId = event.dataTransfer.getData("cardId");
	const card = document.querySelector(`#${cardId}`);

	event.target.appendChild(card);

	updateLaneSize(card.getAttribute("lane"));
	updateLocalStorage(card.getAttribute("lane"));
	card.setAttribute("lane", event.target.getAttribute("lane"));
	updateLaneSize(event.target.getAttribute("lane"));
	updateLocalStorage(event.target.getAttribute("lane"));
}

function dragOver(e) {
	e.preventDefault();
	//   console.log("dragOver");
}

// function dragEnter() {
// 	console.log("dragEnter");
// }

// function dragLeave() {
// 	console.log("dragLeave");
// }

// function dragDrop() {
// 	this.appendChild(draggableTodo);
// 	// console.log("dropped");
// }

// ADD NEW TASK TODO

const resetModal = () => {
	newCategory.value = "";
	newTitle.value = "";
	newContent.value = "";

	document.querySelectorAll("input").forEach((element) => {
		element.style.borderColor = "#333333";
	});
	document.querySelectorAll("textarea").forEach((element) => {
		element.style.borderColor = "#333333";
	});
};

document.querySelectorAll("input").forEach((element) => {
	element.onblur = function (event) {
		if (event.target.value !== "") event.target.style.borderColor = "green";
		else event.target.style.borderColor = "red";
	};
});
document.querySelectorAll("textarea").forEach((element) => {
	element.onblur = function (event) {
		if (event.target.value !== "") event.target.style.borderColor = "green";
		else event.target.style.borderColor = "red";
	};
});

const handleEditButtonClicked = (cardId) => {
	const cardElement = document.querySelector(`#${cardId}`);
	const categoryElement = cardElement.querySelector(`[data="category"]`);
	const titleElement = cardElement.querySelector(`[data="title"]`);
	const contentElement = cardElement.querySelector(`[data="content"]`);

	const form = editTodoModal.querySelector("form");
	const formData = new FormData(form);

	formData.set("category", categoryElement.innerHTML);
	formData.set("title", titleElement.innerHTML);
	formData.set("content", contentElement.innerHTML);
	formData.set("task", cardElement.getAttribute("lane"));

	form.querySelector(`[name="category"]`).value = formData.get("category");
	form.querySelector(`[name="title"]`).value = formData.get("title");
	form.querySelector(`[name="content"]`).value = formData.get("content");

	const taskRadio = form.querySelector(
		`[name="task"][value=${cardElement.getAttribute("lane")}]`
	);
	taskRadio.value = formData.get("task");
	taskRadio.click();

	editTodoModal.style.display = "block";

	submitEditModal.onclick = function (event) {
		event.preventDefault();

		const form = editTodoModal.querySelector("form");
		const formData = new FormData(form);

		let isValid = true;
		if (formData.get("category") === "") {
			form.querySelector(`[name="category"]`).style.borderColor = "red";
			isValid = false;
		}
		if (formData.get("title") === "") {
			form.querySelector(`[name="title"]`).style.borderColor = "red";
			isValid = false;
		}
		if (formData.get("content") === "") {
			form.querySelector(`[name="content"]`).style.borderColor = "red";
			isValid = false;
		}

		if (!isValid) return;

		categoryElement.innerHTML = formData.get("category");
		titleElement.innerHTML = formData.get("title");
		contentElement.innerHTML = formData.get("content");
		cardElement.setAttribute("lane", formData.get("task"));

		const targetLane = document.querySelector(
			`#${cardElement.getAttribute("lane")}-lane`
		);
		if (cardElement.getAttribute("lane") !== taskRadio.value) {
			targetLane.appendChild(cardElement);
			updateLaneSize(taskRadio.value);
			updateLocalStorage(taskRadio.value);
		}

		editTodoModal.style.display = "none";
		updateLaneSize(targetLane.getAttribute("lane"));
		updateLocalStorage(targetLane.getAttribute("lane"));

		resetModal();
	};
};

const handleDeleteButtonClicked = (cardId) => {
	const cardElement = document.querySelector(`#${cardId}`);
	cardElement.parentElement.removeChild(cardElement);
	updateLaneSize(cardElement.getAttribute("lane"));
	updateLocalStorage(cardElement.getAttribute("lane"));
};

const updateLaneSize = (laneName) => {
	const laneElement = document.querySelector(`[lane="${laneName}"]`);
	const badgeElement = laneElement.querySelector(".badge");

	const cardElements = laneElement.querySelectorAll(".card");
	badgeElement.innerHTML = cardElements.length;

	console.log("Update lanesize");
	console.log(laneName);
	console.log(cardElements.length);
};

const updateLocalStorage = (laneName) => {
	const laneElement = document.querySelector(`[lane="${laneName}"]`);
	const cardElements = laneElement.querySelectorAll(".card");

	const data = [];
	cardElements.forEach((cardElement) => {
		const categoryElement = cardElement.querySelector(`[data="category"]`);
		const titleElement = cardElement.querySelector(`[data="title"]`);
		const contentElement = cardElement.querySelector(`[data="content"]`);
		const createAtElement = cardElement.querySelector(`[data="createAt"]`);

		const item = {
			id: cardElement.id,
			category: categoryElement.innerHTML,
			title: titleElement.innerHTML,
			content: contentElement.innerHTML,
			createAt: createAtElement.innerHTML,
		};
		data.push(item);
	});

	console.log("Update local storage");
	console.log(laneName);
	console.log(data);
	localStorage.setItem(laneName, JSON.stringify(data));
};

const createNewTodo = (event) => {
	event.preventDefault();

	const form = addNewTodoModal.querySelector("form");

	let isValid = true;
	if (newCategory.value === "") {
		newCategory.style.borderColor = "red";
		isValid = false;
	}
	if (newTitle.value === "") {
		newTitle.style.borderColor = "red";
		isValid = false;
	}
	if (newContent.value === "") {
		newContent.style.borderColor = "red";
		isValid = false;
	}

	if (!isValid) return;

	const id = `card_${Date.now()}`;
	var options = { month: "long", day: "numeric", year: "numeric" };
	const html = `
    <div id="${id}" class="card" draggable="true" lane="todo" ondragstart="dragStart(event)" ondragend="dragEnd(event)">
        <div class="card-header">
            <h3 class="heading-tertiary" data="category">${
							newCategory.value
						}</h3>
            <div>
                <a class="open-edit-task-modal"><img src="image/icon-edit.png" src="Edit" onclick="handleEditButtonClicked('${id}')"></a>
                <a class="delete-task"><img src="image/icon-delete.png" src="Delete" onclick="handleDeleteButtonClicked('${id}')"></a>
            </div>
        </div>
        <div class="card-content">
            <h1 class="heading-primary" data="title">${newTitle.value}</h1>
        </div>
        <div class="line-space"></div>
        <div class="card-footer">
            <p class="subheading" data="content">${newContent.value}</p>
            <div class="card-time">
                <img src="image/icon-clock.png">
                <p data="createAt">${new Date().toLocaleDateString(
									"en-US",
									options
								)}</p>
            </div>
        </div>
    </div>
    `;

	todoLane.insertAdjacentHTML("beforeend", html);
	addNewTodoModal.style.display = "none";

	resetModal();
	updateLaneSize("todo");
	updateLocalStorage("todo");
};

newTodoSubmit.addEventListener("click", createNewTodo);

// // DELETE TASK
// deleteCards.forEach((deleteCard, index) => {
// 	deleteCard.addEventListener("click", function () {
// 		const cardElements = todoLane.querySelectorAll(".card");
// 		todoLane.removeChild(cardElements[index]);
// 	});
// });
