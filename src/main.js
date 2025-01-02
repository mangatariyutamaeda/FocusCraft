import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('focuscraft-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const viewList = document.getElementById('view-list');
    let currentInProgressId = null;

    const initializeApp = () => {
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        loadViews((views) => {
            renderViewList(viewList, views);
        });
    };

    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => {
                if (!task.inProgress && currentInProgressId) {
                    updateTodoStatus(currentInProgressId, { inProgress: false });
                }
                updateTodoStatus(id, { inProgress: !task.inProgress });
                currentInProgressId = !task.inProgress ? id : null;
            },
            onDelete: (id) => deleteTodo(id),
        });

        todoList.appendChild(taskElement);
    };

    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
        }
    });

    saveViewBtn.addEventListener('click', () => {
        const tasks = [...todoList.childNodes].map((node) => node.dataset);
        saveView('ビュー名', tasks);
    });

    initializeApp();
});
