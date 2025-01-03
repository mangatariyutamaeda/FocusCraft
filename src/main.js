import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';
import { updateTaskDetails } from './todoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const focusModeBtn = document.getElementById('focus-mode-btn');
    const mainViewBtn = document.getElementById('main-view-btn');
    const mainView = document.getElementById('main-view');
    const focusMode = document.getElementById('focus-mode');
    const focusTaskTitle = document.getElementById('focus-task-title');
    const focusTaskNotes = document.getElementById('focus-task-notes');
    const focusTaskGoal = document.getElementById('focus-task-goal');
    const focusTaskTime = document.getElementById('focus-task-time');
    const todoInput = document.getElementById('focuscraft-input');
    const tagInput = document.getElementById('tag-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const searchBox = document.getElementById('search-box');

    let currentInProgressId = null;
    let currentInProgressTask = null;

    const initializeApp = () => {
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        loadViews((views) => {
            renderViewList(viewList, views, searchBox, (tasks) => {
                todoList.innerHTML = ''; // 現在のタスクリストをリセット
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });
    };

    const updateFocusTask = (id, task) => {
        currentInProgressTask = { ...task, id };
    };

    const onInProgress = (id, task) => {
        if (currentInProgressId) {
            const previousTask = document.querySelector(`[data-id="${currentInProgressId}"]`);
            if (previousTask) {
                const btn = previousTask.querySelector('.in-progress-btn');
                if (btn) {
                    btn.textContent = '実施中に設定';
                }
            }
        }

        currentInProgressId = id;
        updateFocusTask(id, task);

        const currentTask = document.querySelector(`[data-id="${id}"]`);
        if (currentTask) {
            const btn = currentTask.querySelector('.in-progress-btn');
            if (btn) {
                btn.textContent = '実施中';
            }
        }

        if (focusTaskTitle) {
            focusTaskTitle.textContent = task.text || 'なし';
        }
    };

    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => onInProgress(id, task),
            onDelete: (id) => {
                if (id === currentInProgressId) {
                    currentInProgressId = null;
                    focusTaskTitle.textContent = 'なし';
                }
                deleteTodo(id);
            },
        });

        taskElement.setAttribute('data-id', id);
        todoList.appendChild(taskElement);
    };

    focusModeBtn.addEventListener('click', () => {
        mainView.style.display = 'none';
        focusMode.style.display = 'block';

        if (currentInProgressTask) {
            focusTaskTitle.textContent = `タスク: ${currentInProgressTask.text}`;
            focusTaskNotes.value = currentInProgressTask.notes || '';
            focusTaskGoal.value = currentInProgressTask.goal || '';
            focusTaskTime.value = currentInProgressTask.time || '';
        } else {
            focusTaskTitle.textContent = 'タスク: 現在のタスクはありません';
            focusTaskNotes.value = '';
            focusTaskGoal.value = '';
            focusTaskTime.value = '';
        }
    });

    mainViewBtn.addEventListener('click', () => {
        focusMode.style.display = 'none';
        mainView.style.display = 'block';
    });

    focusTaskNotes.addEventListener('input', () => {
        if (currentInProgressTask) {
            currentInProgressTask.notes = focusTaskNotes.value;
            updateTaskDetails(currentInProgressTask.id, { notes: focusTaskNotes.value });
        }
    });

    focusTaskGoal.addEventListener('input', () => {
        if (currentInProgressTask) {
            currentInProgressTask.goal = focusTaskGoal.value;
            updateTaskDetails(currentInProgressTask.id, { goal: focusTaskGoal.value });
        }
    });

    focusTaskTime.addEventListener('input', () => {
        if (currentInProgressTask) {
            currentInProgressTask.time = focusTaskTime.value;
            updateTaskDetails(currentInProgressTask.id, { time: focusTaskTime.value });
        }
    });

    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        const tags = tagInput.value.trim().split(',').map((tag) => tag.trim());

        if (todoText) {
            addTodo(todoText, tags);
            todoInput.value = '';
            tagInput.value = '';
        }
    });

    saveViewBtn.addEventListener('click', () => {
        const searchQuery = searchBox.value.trim();

        if (!searchQuery) {
            alert('検索条件を入力してください');
            return;
        }

        saveView(searchQuery, { searchQuery }).then(() => {
            loadViews();
        });
    });

    searchBox.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const tasks = [...todoList.childNodes];

        tasks.forEach((task) => {
            const taskNameElement = task.querySelector('span');
            if (taskNameElement) {
                const taskName = taskNameElement.textContent.toLowerCase();
                task.style.display = taskName.includes(searchText) ? 'flex' : 'none';
            }
        });
    });

    initializeApp();
});
