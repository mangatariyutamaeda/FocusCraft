import { addTodo, loadTodos, updateTodoStatus, deleteTodo } from './todoManager.js';
import { saveView, loadViews } from './viewsManager.js';
import { renderTaskList, createTaskElement, renderViewList } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('focuscraft-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const viewList = document.getElementById('view-list');
    let currentInProgressId = null;

    const initializeApp = () => {
        // タスクをロードしてリストに表示
        loadTodos((todos) => {
            renderTaskList(todoList, todos, addTodoToList);
        });

        // 保存されたビューをロードして左側に表示
        loadViews((views) => {
            renderViewList(viewList, views, (tasks) => {
                // ビューがクリックされたときの動作
                todoList.innerHTML = ''; // 現在のタスクリストをリセット
                tasks.forEach((task) => addTodoToList(task.id, task));
            });
        });
    };

    let currentInProgressId = null;
    
    const addTodoToList = (id, task) => {
        const taskElement = createTaskElement(task, id, {
            onComplete: (id) => updateTodoStatus(id, { completed: !task.completed }),
            onInProgress: (id) => {
                // 現在の「実施中」をリセット
                if (currentInProgressId) {
                    const previousTask = document.querySelector(`[data-id="${currentInProgressId}"]`);
                    if (previousTask) {
                        const btn = previousTask.querySelector('.in-progress-btn');
                        btn.textContent = '実施中に設定';
                    }
                }
    
                // 新しい「実施中」を設定
                currentInProgressId = id;
                const currentTask = document.querySelector(`[data-id="${id}"]`);
                if (currentTask) {
                    const btn = currentTask.querySelector('.in-progress-btn');
                    btn.textContent = '実施中';
                }
            },
            onDelete: (id) => {
                if (id === currentInProgressId) {
                    currentInProgressId = null; // 実施中をリセット
                }
                deleteTodo(id);
            },
        });
    
        taskElement.setAttribute('data-id', id); // タスクの要素にIDを設定
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
        const tasks = [...todoList.childNodes].map((node) => {
            const task = {
                id: node.dataset.id,
                text: node.querySelector('span').textContent,
                completed: node.querySelector('button:nth-child(2)').textContent === '未完了に戻す',
                inProgress: node.querySelector('button:nth-child(3)').textContent === '実施中',
            };
            return task;
        });

        const viewName = tasks.map((task) => task.text).join(', ') || 'すべてのタスク';
        saveView(viewName, tasks).then(() => loadViews());
    });

    initializeApp();
});




