import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyAgW5Aqqnx8nN6-7hAOFhQO8K2-UTRYDd8",
    authDomain: "focuscraft-9693e.firebaseapp.com",
    databaseURL: "https://focuscraft-9693e-default-rtdb.firebaseio.com",
    projectId: "focuscraft-9693e",
    storageBucket: "focuscraft-9693e.firebasestorage.app",
    messagingSenderId: "393976628205",
    appId: "1:393976628205:web:18db41e35ed2a2bc381de4",
    measurementId: "G-4YRYKM6D11"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('focuscraft-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('focuscraft-list');
    const searchBox = document.getElementById('search-box');
    const tagList = document.getElementById('tag-list');
    const saveViewBtn = document.getElementById('save-view-btn');
    const headerRow = document.createElement('div');
    headerRow.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span style="flex: 2;">タスク名</span>
            <span style="flex: 1; text-align: center;">完了状況</span>
            <span style="flex: 1; text-align: center;">現在実施中のタスク</span>
            <span style="flex: 1; text-align: center;">タスクの削除</span>
        </div>
    `;
    todoList.parentElement.insertBefore(headerRow, todoList);

    let currentInProgressId = null; // 現在「実施中」のタスクID
    const selectedTags = new Set();

    // タスクをデータベースに追加
    const addTodo = (todoText, tags = []) => {
        const newTodoRef = push(ref(database, 'todos'));
        set(newTodoRef, { text: todoText, completed: false, inProgress: false, tags });
    };

    // データベースからタスクを取得して表示
    const loadTodos = () => {
        onValue(ref(database, 'todos'), (snapshot) => {
            const todos = snapshot.val();
            todoList.innerHTML = ''; // リストをリセット

            if (todos) {
                for (const id in todos) {
                    addTodoToList(id, todos[id]);
                }
            }
        });
    };

    // HTMLリストにタスクを追加
    const addTodoToList = (id, todo) => {
        const li = document.createElement('div');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const taskName = document.createElement('span');
        taskName.style.flex = '2';
        taskName.textContent = todo.text;

        if (todo.completed) {
            taskName.style.textDecoration = 'line-through';
        }

        // 完了ボタン
        const completeBtn = document.createElement('button');
        completeBtn.style.flex = '1';
        completeBtn.textContent = todo.completed ? '未完了に戻す' : '完了';
        completeBtn.addEventListener('click', () => {
            update(ref(database, `todos/${id}`), { completed: !todo.completed });
        });

        // 実施中ボタン
        const inProgressBtn = document.createElement('button');
        inProgressBtn.style.flex = '1';
        inProgressBtn.textContent = todo.inProgress ? '実施中' : '実施中に設定';
        inProgressBtn.addEventListener('click', () => {
            if (!todo.inProgress) {
                if (currentInProgressId) {
                    // 他のタスクの実施中ステータスを解除
                    update(ref(database, `todos/${currentInProgressId}`), { inProgress: false });
                }
                update(ref(database, `todos/${id}`), { inProgress: true });
                currentInProgressId = id;
            } else {
                update(ref(database, `todos/${id}`), { inProgress: false });
                currentInProgressId = null;
            }
        });

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.style.flex = '1';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => {
            remove(ref(database, `todos/${id}`));
        });

        li.appendChild(taskName);
        li.appendChild(completeBtn);
        li.appendChild(inProgressBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

    // タグを取得して表示
    onValue(ref(database, 'tags'), (snapshot) => {
        const tags = snapshot.val();
        tagList.innerHTML = '';

        if (tags) {
            for (const tag in tags) {
                const tagBtn = document.createElement('button');
                tagBtn.textContent = tag;
                tagBtn.addEventListener('click', () => {
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                    } else {
                        selectedTags.add(tag);
                    }
                    filterByTags([...selectedTags]);
                });
                tagList.appendChild(tagBtn);
            }
        }
    });

    // 現在のビューを保存
    saveViewBtn.textContent = '現在のビューを保存';
    saveViewBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        const viewName = prompt('保存するビューの名前を入力してください:');

        if (viewName) {
            const filteredTasks = [];
            onValue(ref(database, 'todos'), (snapshot) => {
                const todos = snapshot.val();
                for (const id in todos) {
                    if (query === '' || todos[id].text.includes(query)) {
                        filteredTasks.push({ id, ...todos[id] });
                    }
                }

                // ビューを保存
                set(ref(database, `views/${viewName}`), filteredTasks)
                    .then(() => alert('ビューを保存しました！'))
                    .catch((error) => console.error('ビューの保存中にエラーが発生しました:', error));
            }, { onlyOnce: true });
        }
    });

    // 初期化
    loadTodos();

    // 検索イベントを設定
    searchBox.placeholder = 'タスクを検索';
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        filterTasks(query);
    });

    // ボタンクリックでタスクを追加
    addBtn.textContent = '追加';
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();

        if (todoText) {
            addTodo(todoText);
            todoInput.value = ''; // 入力フィールドをリセット
        } else {
            alert('タスクは空にできません！');
        }
    });

    // 検索用
    const filterTasks = (query) => {
        onValue(ref(database, 'todos'), (snapshot) => {
            const todos = snapshot.val();
            todoList.innerHTML = ''; // リストをリセット

            if (todos) {
                for (const id in todos) {
                    const task = todos[id];
                    if (task.text.includes(query)) {
                        addTodoToList(id, task);
                    }
                }
            }
        });
    };

    // タグでタスクをフィルタリング
    const filterByTags = (tags) => {
        onValue(ref(database, 'todos'), (snapshot) => {
            const todos = snapshot.val();
            todoList.innerHTML = '';

            if (todos) {
                for (const id in todos) {
                    const task = todos[id];
                    if (tags.some(tag => task.tags && task.tags.includes(tag))) {
                        addTodoToList(id, task);
                    }
                }
            }
        });
    };
});
