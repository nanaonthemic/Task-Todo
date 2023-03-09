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
const todoLaneBody = document.querySelector("#todo-lane-body");
const doingLane = document.querySelector("#doing-lane");
const doingLaneBody = document.querySelector("#doing-lane-body");
const finishedLane = document.querySelector("#finished-lane");
const finishedLaneBody = document.querySelector("#finished-lane-body");

const cards = document.querySelectorAll(".card");
const allSwimlanes = document.querySelectorAll(".swim-lane");

const newCategory = document.querySelector("#new-category");
const newTitle = document.querySelector("#new-title");
const newContent = document.querySelector("#new-content");

const renderLane = (laneName) => {
	const lane = document.querySelector(`#${laneName}-lane-body`);

	const data = JSON.parse(localStorage.getItem(laneName) || "[]");
	data.map(({ id, category, title, content, createAt }) => {
		const htmlContent = `
    <div id="${id}" class="card" draggable="true" lane=${laneName} ondragstart="dragStart(event)" ondragend="dragEnd(event)">
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
openNewTodoModal.addEventListener("click", function () {
	addNewTodoModal.style.display = "block";
});
closeNewTodoModal.addEventListener("click", function () {
	addNewTodoModal.style.display = "none";
});

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

//RESET MODAL

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

// HANDLE EDIT BUTTON SUBMIT MODAL
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
	taskRadio.click();
	taskRadio.value = formData.get("task");

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
			`#${cardElement.getAttribute("lane")}-lane-body`
		);
		if (cardElement.getAttribute("lane") !== taskRadio.value) {
			targetLane.appendChild(cardElement);
			updateLaneSize(taskRadio.value);
			updateLocalStorage(taskRadio.value);
		}

		editTodoModal.style.display = "none";
		updateLaneSize(targetLane.parentElement.parentElement.getAttribute("lane"));
		updateLocalStorage(
			targetLane.parentElement.parentElement.getAttribute("lane")
		);

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
};

// ADD NEW TASK TODO

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
	// todoLaneBody.appendChild(html);
	todoLaneBody.insertAdjacentHTML("beforeend", html);
	addNewTodoModal.style.display = "none";
	document.querySelector(`#${id}`).addEventListener("dragstart", dragStart);
	document.querySelector(`#${id}`).addEventListener("dragend", dragEnd);
	resetModal();
	updateLaneSize("todo");
	updateLocalStorage("todo");
};

newTodoSubmit.addEventListener("click", createNewTodo);

// DRAG AND DROP

const allSwimlaneBody = document.querySelectorAll(".swim-lane-body");
let draggableTodo = null;

function dragStart(event) {
	draggableTodo = event.target;
	setTimeout(() => {
		event.target.style.display = "none";
	}, 0);
}
function dragEnd(event) {
	draggableTodo = null;
	setTimeout(() => {
		event.target.style.display = "block";
	}, 0);
}

allSwimlaneBody.forEach((lane) => {
	lane.addEventListener("dragover", dragOver);
	lane.addEventListener("dragenter", dragEnter);
	lane.addEventListener("dragleave", dragLeave);
	lane.addEventListener("drop", dragDrop);
});

function dragOver(e) {
	e.preventDefault();
}

function dragEnter() {
	console.log("dragEnter");
}

function dragLeave() {
	console.log("dragLeave");
}

function dragDrop(event) {
	event.target.appendChild(draggableTodo);
	console.log("dropped");
	updateLaneSize(draggableTodo.getAttribute("lane"));
	updateLaneSize(event.target.parentElement.parentElement.getAttribute("lane"));
	updateLocalStorage(draggableTodo.getAttribute("lane"));
	updateLocalStorage(
		event.target.parentElement.parentElement.getAttribute("lane")
	);
}

// UPDATE LOCAL STOTRAGE

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
	localStorage.setItem(laneName, JSON.stringify(data));
};
