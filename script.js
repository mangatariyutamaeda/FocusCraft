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
    let currentInProgressId = null; // 現在「実施中」のタスクID

    // タスクをデータベースに追加
    const addTodo = (todoText) => {
        const newTodoRef = push(ref(database, 'todos'));
        set(newTodoRef, { text: todoText, completed: false, inProgress: false });
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
        completeBtn.textContent = todo.completed ? 'Completed' : 'Complete';
        completeBtn.disabled = todo.completed;
        completeBtn.addEventListener('click', () => {
            update(ref(database, `todos/${id}`), { completed: true });
        });

        // 実施中ボタン
        const inProgressBtn = document.createElement('button');
        inProgressBtn.textContent = todo.inProgress ? 'In Progress' : 'Set In Progress';
        inProgressBtn.disabled = todo.inProgress;
        inProgressBtn.addEventListener('click', () => {
            if (currentInProgressId) {
                // 他のタスクの実施中ステータスを解除
                update(ref(database, `todos/${currentInProgressId}`), { inProgress: false });
            }
            update(ref(database, `todos/${id}`), { inProgress: true });
            currentInProgressId = id;
        });

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            remove(ref(database, `todos/${id}`));
        });

        li.appendChild(completeBtn);
        li.appendChild(inProgressBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

    // 初期化
    loadTodos();

    // ボタンクリックでタスクを追加
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();

        if (todoText) {
            addTodo(todoText);
            todoInput.value = ''; // 入力フィールドをリセット
        } else {
            alert('Task cannot be empty!');
        }
    });
document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search-box');
    const todoList = document.getElementById('focuscraft-list');

    // 検索イベントを設定
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim().toLowerCase();
        filterTasks(query);
    });

    // タスクをフィルタリングする
    const filterTasks = (query) => {
        onValue(ref(database, 'todos'), (snapshot) => {
            const todos = snapshot.val();
            todoList.innerHTML = ''; // リストをリセット

            if (todos) {
                for (const id in todos) {
                    const task = todos[id];
                    if (task.text.toLowerCase().includes(query)) {
                        addTodoToList(id, task);
                    }
                }
            }
        });
    };

    // タスクをリストに表示
    const addTodoToList = (id, todo) => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        todoList.appendChild(li);
    };
});

});
