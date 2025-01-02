export const renderTaskList = (todoList, tasks, addTodoToList) => {
    todoList.innerHTML = '';

    // ヘッダーの作成
    const header = document.createElement('div');
    header.classList.add('task-header');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.fontWeight = 'bold';
    header.style.padding = '10px';
    header.style.borderBottom = '1px solid #ccc';

    header.innerHTML = `
        <div style="flex: 2; text-align: center;">タスク名</div>
        <div style="flex: 1; text-align: center;">完了状況</div>
        <div style="flex: 1; text-align: center;">現在実施中のタスク</div>
        <div style="flex: 1; text-align: center;">タスクの削除</div>
    `;

    todoList.appendChild(header);

    // タスクの追加
    if (tasks) {
        for (const id in tasks) {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task-item');
            addTodoToList(id, tasks[id], taskDiv);
            todoList.appendChild(taskDiv);
        }
    }
};

export const createTaskElement = (task, id, handlers) => {
    const { onComplete, onInProgress, onDelete } = handlers;

    const li = document.createElement('div');
    li.classList.add('task-item');

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
