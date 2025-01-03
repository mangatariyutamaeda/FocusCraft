import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('focuscraft-input');
    const tagInput = document.getElementById('tag-input'); // タグ入力フィールドを取得
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const viewList = document.getElementById('view-list');
    const searchBox = document.getElementById('search-box');

    let currentInProgressId = null;

    const initializeApp = () => {
        // タスクをロードしてリストに表示
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        // 保存されたビューをロードして左側に表示
        loadViews((views) => {
            renderViewList(viewList, views, searchBox, (tasks) => {
                todoList.innerHTML = ''; // 現在のタスクリストをリセット
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });        
    };

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
                currentTaskElement.textContent = task.text;
            
                const currentTask = document.querySelector(`[data-id="${id}"]`);
                if (currentTask) {
                    const btn = currentTask.querySelector('.in-progress-btn');
                    if (btn) {
                        btn.textContent = '実施中';
                    }
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




