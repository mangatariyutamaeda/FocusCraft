import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('focuscraft-input');
    const tagInput = document.getElementById('tag-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const viewList = document.getElementById('view-list');
    const searchBox = document.getElementById('search-box');
    const currentTaskElement = document.getElementById('current-task');

    let currentInProgressId = null; // 実施中のタスクID
    let currentInProgressTask = null; // 実施中のタスクデータ

    const initializeApp = () => {
        // タスクをロードしてリストに表示
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        // 保存されたビューをロードして左側に表示
        loadViews((views) => {
            renderViewList(viewList, views, searchBox, (tasks) => {
                todoList.innerHTML = '';
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });
    };

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
                    // 以前のタスクをリセット
                    const previousTask = document.querySelector(`[data-id="${currentInProgressId}"]`);
                    if (previousTask) {
                        const btn = previousTask.querySelector('.in-progress-btn');
                        if (btn) {
                            btn.textContent = '実施中に設定';
                        }
                    }
                }

                // 現在のタスクを更新
                currentInProgressId = id;
                currentInProgressTask = task;

                // ボタンテキストを更新
                const currentTask = document.querySelector(`[data-id="${id}"]`);
                if (currentTask) {
                    const btn = currentTask.querySelector('.in-progress-btn');
                    if (btn) {
                        btn.textContent = '実施中';
                    }
                }

                // 表示を更新
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

        taskElement.setAttribute('data-id', id); // タスクの要素にIDを設定
        todoList.appendChild(taskElement);
    };

    // タスクを追加
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        const tags = tagInput.value.trim().split(',').map((tag) => tag.trim());

        if (todoText) {
            addTodo(todoText, tags);
            todoInput.value = '';
            tagInput.value = '';
        }
    });

    // ビューを保存
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

    // タスクの絞り込み
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

    // アプリを初期化
    initializeApp();
});
