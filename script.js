import { database } from './index.html'; // Firebase初期化をインポート
import { ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // ToDoをデータベースに追加
    const addTodo = (todoText) => {
        const newTodoRef = push(ref(database, 'todos'));
        set(newTodoRef, { text: todoText });
    };

    // データベースからToDoを取得して表示
    const loadTodos = () => {
        onValue(ref(database, 'todos'), (snapshot) => {
            const todos = snapshot.val();
            todoList.innerHTML = ''; // リストをリセット
            for (const id in todos) {
                addTodoToList(id, todos[id]);
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
            remove(ref(database, `todos/${id}`));
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
        }
    });
});
