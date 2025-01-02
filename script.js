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
        const li = document.createElement('li');
        li.textContent = todo.text;

        // 完了ボタン
        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.completed ? '未実施に戻す' : '完了';
        completeBtn.addEventListener('click', () => {
            update(ref(database, `todos/${id}`), { completed: !todo.completed });
        });

        // 実施中ボタン
        const inProgressBtn = document.createElement('button');
        inProgressBtn.textContent = todo.inProgress ? '実施中' : '実施中に設定';
        inProgressBtn.addEventListener('click', () => {
            if (todo.inProgress) {
                update(ref(database, `todos/${id}`), { inProgress: false });
                currentInProgressId = null;
            } else {
                if (currentInProgressId) {
                    // 他のタスクの実施中ステータスを解除
                    update(ref(database, `todos/${currentInProgressId}`), { inProgress: false });
                }
                update(ref(database, `todos/${id}`), { inProgress: true });
                currentInProgressId = id;
            }
        });

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => {
            remove(ref(database, `todos/${id}`));
        });

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

    // 初期化
    loadTodos();

    // 検索イベントを設定
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        filterTasks(query);
    });

    // ボタンクリックでタスクを追加
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
