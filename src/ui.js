export const renderTaskList = (todoList, tasks, addTodoToList) => {
    todoList.innerHTML = '';
    if (tasks) {
        for (const id in tasks) {
            addTodoToList(id, tasks[id]);
        }
    }
};

export const createTaskElement = (task, id, handlers) => {
    const { onComplete, onInProgress, onDelete } = handlers;

    const li = document.createElement('div');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const taskName = document.createElement('span');
    taskName.style.flex = '2';
    taskName.textContent = task.text;

    if (task.completed) {
        taskName.style.textDecoration = 'line-through';
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '未完了に戻す' : '完了';
    completeBtn.addEventListener('click', () => onComplete(id));

    const inProgressBtn = document.createElement('button');
    inProgressBtn.textContent = task.inProgress ? '実施中' : '実施中に設定';
    inProgressBtn.addEventListener('click', () => onInProgress(id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => onDelete(id));

    li.appendChild(taskName);
    li.appendChild(completeBtn);
    li.appendChild(inProgressBtn);
    li.appendChild(deleteBtn);

    return li;
};

export const renderViewList = (viewListElement, views, onViewClick) => {
    viewListElement.innerHTML = ''; // リストをリセット
    for (const viewName in views) {
        const viewButton = document.createElement('button');
        viewButton.textContent = viewName; // ビュー名を表示
        viewButton.addEventListener('click', () => onViewClick(views[viewName]));
        viewListElement.appendChild(viewButton);
    }
};
