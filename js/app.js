const columns = document.querySelectorAll('.column');
const addButton = document.querySelector('.add');
const emptyButton = document.querySelector('.empty');
const textInput = document.getElementById("task-text");
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

tasks.forEach(task => {
    const newTask = createTask();
    newTask.textContent = task.task;
    newTask.setAttribute('id', `task-${task.id}`);
    const column = document.getElementById(task.column);
    const removeButton = createRemoveButton();
    newTask.appendChild(removeButton);
    column.appendChild(newTask);
});

addButton.addEventListener('click', createTaskHandler);
document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        createTaskHandler(e);
    }
});

emptyButton.addEventListener('click', () => {
    columns.forEach(column => {
        column.querySelectorAll('.task').forEach(task => {
            task.remove();
        });
    });
    localStorage.clear();
});


columns.forEach(column => {
    column.addEventListener('dragstart', dragstartHandler);
    column.addEventListener('dragover', dragoverHandler);
    column.addEventListener('drop', dropHandler);
});

function dragstartHandler(e) {
    e.dataTransfer.setData("taskId", e.target.id);
    e.dataTransfer.setData("columnId", e.target.parentNode.id);
}

function dragoverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function dropHandler(e) {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");

    let task = document.getElementById(taskId);

    if (e.target.id.includes('task')) {
        return;
    }

    if (e.target.className.includes('column')) {
        e.target.appendChild(task);
    }

    updateTasksColumn(task.id, task.parentElement.id);
    
    if (e.target.id.includes('done')) {
        task.classList.add('done-task');
        task.setAttribute('contenteditable', 'false');
    } else {
        task.classList.remove('done-task');
        task.setAttribute('contenteditable', 'true');
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskHandler(e) {
    deleteTaskFromStorage(e.target.parentNode.id);
    deleteTaskFromTasksArray(e);
    e.target.parentNode.remove();
}

function createTaskHandler(e) {
    const task = createTask();
    let taskId = generateTaskId();

    task.setAttribute('id', `task-${taskId}`);
    columns[0].appendChild(task);

    let taskContent = clearTaskContent(task);

    tasks.push({task:taskContent, id: taskId, column: task.parentElement.id});
    localStorage.setItem('tasks', JSON.stringify(tasks));

    textInput.value = '';
}

function createTask() {
    const task = document.createElement('div');
    
    task.setAttribute('contenteditable', 'true');
    task.setAttribute('draggable', 'true');

    task.textContent = document.querySelector('#task-text').value || 'New Task';
    task.classList.add('task');

    let removeButton = createRemoveButton();
    task.appendChild(removeButton);
    removeButton.addEventListener('click', removeTaskHandler);

    return task;
}

function updateTasksColumn(htmlTaskId, columnId) {

    let taskId = htmlTaskId.split('-')[1];
    
    tasks.forEach(task => {
        if (task.id == taskId) {
            task.column = columnId;
        }
    });
}

function clearTaskContent(task) {
    let taskContent = task.textContent;
    taskContent = taskContent.substring(0, taskContent.length - 1);
    return taskContent;
}

function createRemoveButton() {
    let removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-button');
    removeButton.setAttribute('contenteditable', 'false');
    removeButton.addEventListener('click', removeTaskHandler);
    return removeButton;
}

function deleteTaskFromStorage(taskId) {
    let id = taskId.split('-')[1];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromTasksArray(e) {
    let id = e.target.parentNode.id.split('-')[1];
    tasks = tasks.filter(task => task.id != id);
    console.log(tasks);
}

function generateTaskId() {
    return document.querySelectorAll('.task').length + 1;
}

