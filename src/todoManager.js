import { database, ref, set, push, onValue, update, remove } from './firebase.js';

export const addTodo = (todoText, tags = []) => {
    const newTodoRef = push(ref(database, 'todos'));
    return set(newTodoRef, { text: todoText, completed: false, inProgress: false, tags });
};

export const loadTodos = (callback) => {
    onValue(ref(database, 'todos'), (snapshot) => {
        const todos = snapshot.val();
        callback(todos);
    });
};

export const updateTodoStatus = (id, updates) => {
    return update(ref(database, `todos/${id}`), updates);
};

export const deleteTodo = (id) => {
    return remove(ref(database, `todos/${id}`));
};
