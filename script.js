import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

    // ToDoをデータベースに追加
    const addTodo = (todoText) => {
        const newTodoRef = push(ref(database, 'todos'));
        set(newTodoRef, { text: todoText, completed: false })
            .then(() => {
                console.log('Task saved successfully!');
            })
            .catch((error) => {
                console.error('Error saving task:', error);
            });
    };

    // データベースからToDoを取得して表示
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

    // HTMLリストにToDoを追加
    const addTodoToList = (id, todo) => {
        const li = document.createElement('li');
        li.textContent = todo.text;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            remove(ref(database, `todos/${id}`))
                .then(() => {
                    console.log('Task deleted successfully!');
                })
                .catch((error) => {
                    console.error('Error deleting task:', error);
                });
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

    // 初期化
    loadTodos();

    // ボタンクリックでToDoを追加
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
        } else {
            alert('Task cannot be empty!');
        }
    });
});
