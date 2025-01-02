export const renderTaskList = (todoList, tasks, addTodoToList) => {
    todoList.innerHTML = '';

    // ヘッダーの作成
    const header = document.createElement('div');
    header.classList.add('task-header');

    header.innerHTML = `
        <div>タスク名</div>
        <div>完了状況</div>
        <div>現在実施中のタスク</div>
        <div>タスクの削除</div>
    `;

    todoList.appendChild(header);

    // タスクの追加
    if (tasks) {
        for (const id in tasks) {
            addTodoToList(id, tasks[id]);
        }
    }
};


export const createTaskElement = (task, id, handlers) => {
    const { onComplete, onInProgress, onDelete } = handlers;

    const li = document.createElement('div');
    li.classList.add('task-item');

    const taskName = document.createElement('div');
    taskName.textContent = task.text;

    if (task.completed) {
        taskName.style.textDecoration = 'line-through';
    }

    const completeBtn = document.createElement('div');
    completeBtn.innerHTML = `<button>${task.completed ? '未完了に戻す' : '完了'}</button>`;
    completeBtn.querySelector('button').addEventListener('click', () => onComplete(id));

    const inProgressBtn = document.createElement('div');
    inProgressBtn.innerHTML = `<button>${task.inProgress ? '実施中' : '実施中に設定'}</button>`;
    inProgressBtn.querySelector('button').addEventListener('click', () => onInProgress(id));

    const deleteBtn = document.createElement('div');
    deleteBtn.innerHTML = `<button>削除</button>`;
    deleteBtn.querySelector('button').addEventListener('click', () => onDelete(id));

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
