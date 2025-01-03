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

    let currentInProgressTask = null;

    // フォーカスモードボタンのイベントリスナー
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

    // 通常モードボタンのイベントリスナー
    mainViewBtn.addEventListener('click', () => {
        focusMode.style.display = 'none';
        mainView.style.display = 'block';
    });

    // タスクを実施中に設定したときの動作を修正
    const updateFocusTask = (id, task) => {
        currentInProgressTask = { ...task, id };
    };

    // 既存の onInProgress を修正
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
    };

    // 既存の addTodoToList を修正して onInProgress を適用
    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => onInProgress(id, task),
            onDelete: (id) => deleteTodo(id),
        });
        todoList.appendChild(taskElement);
    };
});

    const currentTaskElement = document.getElementById('current-task');

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

                const currentTask = document.querySelector(`[data-id="${id}"]`);
                if (currentTask) {
                    const btn = currentTask.querySelector('.in-progress-btn');
                    if (btn) {
                        btn.textContent = '実施中';
                    }
                }

                if (currentTaskElement) {
                    currentTaskElement.textContent = task.text || 'なし';
                }
            },
            onDelete: (id) => {
                if (id === currentInProgressId) {
                    currentInProgressId = null;
                    currentTaskElement.textContent = 'なし';
                }
                deleteTodo(id);
            },
        });

        taskElement.setAttribute('data-id', id); // タスクの要素にIDを設定
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

        // ビュー名は検索条件そのものに設定
        const viewName = searchQuery;
        saveView(viewName, { searchQuery }).then(() => {
            loadViews(); // 保存後にビューリストを更新
        });
    });

    // 絞り込みロジックの実装
    const filterTasks = (searchText) => {
        const tasks = [...todoList.childNodes]; // 現在のタスクリストの子要素を取得

        tasks.forEach((task) => {
            const taskNameElement = task.querySelector('span');
            if (taskNameElement) {
                const taskName = taskNameElement.textContent.toLowerCase();
                // タスク名に検索テキストが含まれているかを判定
                if (taskName.includes(searchText)) {
                    task.style.display = 'flex'; // 表示
                } else {
                    task.style.display = 'none'; // 非表示
                }
            }
        });
    };

    // イベントリスナーを設定
    searchBox.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        filterTasks(searchText);
    });

    initializeApp();
});
