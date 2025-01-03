import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const focusModeBtn = document.getElementById('focus-mode-btn');
    const mainViewBtn = document.getElementById('main-view-btn');
    const mainView = document.getElementById('main-view');
    const focusMode = document.getElementById('focus-mode');
    const focusTaskTitle = document.getElementById('focus-task-title');
    const focusTaskNotes = document.getElementById('focus-task-notes');
    const focusTaskGoal = document.getElementById('focus-task-goal');
    const focusTaskTime = document.getElementById('focus-task-time');
    const focusTaskTags = document.getElementById('focus-task-tags');
    const focusTaskStartTime = document.getElementById('focus-task-start-time');
    const focusTaskEndTime = document.getElementById('focus-task-end-time');
    const focusTaskDuration = document.getElementById('focus-task-duration');
    const startBtn = document.getElementById('focus-task-start-btn');
    const endBtn = document.getElementById('focus-task-end-btn');
    const completeBtn = document.getElementById('focus-task-complete-btn');

    const todoInput = document.getElementById('focuscraft-input');
    const tagInput = document.getElementById('tag-input'); // タグ入力フィールドを取得
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const viewList = document.getElementById('view-list');
    const searchBox = document.getElementById('search-box');

    let currentInProgressTask = null;
    let currentInProgressId = null;
    let startTime = null;

    const initializeApp = () => {
        loadTodos((todos) => {
            if (!todos) {
                console.error('タスクが存在しません。');
                return;
            }
            renderTaskList(todoList, todos, addTodoToList);
        });

        loadViews((views) => {
            if (!views) {
                console.error('ビューが存在しません。');
                return;
            }
            renderViewList(viewList, views, (tasks) => {
                todoList.innerHTML = '';
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });
    };

    const switchToFocusMode = () => {
        mainView.style.display = 'none';
        focusMode.style.display = 'block';

        if (currentInProgressTask) {
            focusTaskTitle.textContent = `タスク: ${currentInProgressTask.text}`;
            focusTaskNotes.value = currentInProgressTask.notes || '';
            focusTaskGoal.value = currentInProgressTask.goal || '';
            focusTaskTime.value = currentInProgressTask.time || '';
            focusTaskTags.textContent = `タグ: ${currentInProgressTask.tags ? currentInProgressTask.tags.join(', ') : 'なし'}`;
        } else {
            focusTaskTitle.textContent = 'タスク: 現在のタスクはありません';
            focusTaskNotes.value = '';
            focusTaskGoal.value = '';
            focusTaskTime.value = '';
            focusTaskTags.textContent = 'タグ: なし';
        }

        focusTaskStartTime.textContent = '開始時刻: なし';
        focusTaskEndTime.textContent = '終了時刻: なし';
        focusTaskDuration.textContent = '経過時間: -';
    };

    const switchToMainView = () => {
        focusMode.style.display = 'none';
        mainView.style.display = 'block';
    };

    focusModeBtn.addEventListener('click', switchToFocusMode);
    mainViewBtn.addEventListener('click', switchToMainView);

    completeBtn.addEventListener('click', () => {
        if (currentInProgressTask) {
            updateTodoStatus(currentInProgressTask.id, { completed: true });
            alert('タスクを完了しました！');
            switchToMainView();
        }
    });

    startBtn.addEventListener('click', () => {
        if (currentInProgressTask) {
            startTime = new Date();
            focusTaskStartTime.textContent = `開始時刻: ${startTime.toLocaleString()}`;
            alert('タスクを開始しました！');
        }
    });

    endBtn.addEventListener('click', () => {
        if (currentInProgressTask && startTime) {
            const endTime = new Date();
            focusTaskEndTime.textContent = `終了時刻: ${endTime.toLocaleString()}`;
            const duration = Math.round((endTime - startTime) / (1000 * 60));
            focusTaskDuration.textContent = `経過時間: ${duration} 分`;
            alert('タスクを終了しました！');
        }
    });

    const updateCurrentTaskDisplay = () => {
        if (currentInProgressTask) {
            currentTaskElement.textContent = currentInProgressTask.text;
        } else {
            currentTaskElement.textContent = 'なし';
        }
    };

    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => {
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
                currentInProgressTask = task;

                const currentTask = document.querySelector(`[data-id="${id}"]`);
                if (currentTask) {
                    const btn = currentTask.querySelector('.in-progress-btn');
                    if (btn) {
                        btn.textContent = '実施中';
                    }
                }

                updateCurrentTaskDisplay();
            },
            onDelete: (id) => {
                if (id === currentInProgressId) {
                    currentInProgressId = null;
                    currentInProgressTask = null;
                    updateCurrentTaskDisplay();
                }
                deleteTodo(id);
            },
        });

        taskElement.setAttribute('data-id', id);
        todoList.appendChild(taskElement);
    };

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
