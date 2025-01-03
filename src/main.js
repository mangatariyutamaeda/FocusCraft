import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';
import { updateTaskDetails } from './todoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
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
    const viewList = document.getElementById('view-list');

    // 状態管理
    let currentInProgressId = null;
    let currentInProgressTask = null;

    // 初期化処理
    const initializeApp = () => {
        // タスクのロード
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        // ビューのロード
        loadViews((views) => {
            renderViewList(viewList, views, searchBox, (tasks) => {
                todoList.innerHTML = '';
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });
    };

    // タスク詳細の更新処理
    const updateFocusTask = (id, task) => {
        currentInProgressTask = { ...task, id };
        focusTaskTitle.textContent = task.text || '現在のタスクはありません';
        focusTaskNotes.value = task.notes || '';
        focusTaskGoal.value = task.goal || '';
        focusTaskTime.value = task.time || '';
    };

    // フォーカスモード切り替え
    focusModeBtn.addEventListener('click', () => {
        mainView.style.display = 'none';
        focusMode.style.display = 'block';

        if (currentInProgressTask) {
            updateFocusTask(currentInProgressTask.id, currentInProgressTask);
        } else {
            focusTaskTitle.textContent = '現在のタスクはありません';
            focusTaskNotes.value = '';
            focusTaskGoal.value = '';
            focusTaskTime.value = '';
        }
    });

    // 通常モード切り替え
    mainViewBtn.addEventListener('click', () => {
        focusMode.style.display = 'none';
        mainView.style.display = 'block';
    });

    // タスク追加処理
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        const tags = tagInput.value.trim().split(',').map((tag) => tag.trim());

        if (todoText) {
            addTodo(todoText, tags);
            todoInput.value = '';
            tagInput.value = '';
        }
    });

    // ビュー保存処理
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

    // タスク絞り込み処理
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

    // フォーカスモードの入力処理
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

    // タスクリストの表示処理
    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => {
                currentInProgressId = id;
                updateFocusTask(id, task);
            },
            onDelete: (id) => {
                if (id === currentInProgressId) {
                    currentInProgressId = null;
                    focusTaskTitle.textContent = '現在のタスクはありません';
                }
                deleteTodo(id);
            },
        });

        taskElement.setAttribute('data-id', id);
        todoList.appendChild(taskElement);
    };

    // アプリ初期化
    initializeApp();
});
