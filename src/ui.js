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
    li.setAttribute('data-id', id); // タスクの要素にIDを設定

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
    inProgressBtn.classList.add('in-progress-btn');
    inProgressBtn.textContent = '実施中に設定';
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
        const viewContainer = document.createElement('div');
        viewContainer.style.display = 'flex';
        viewContainer.style.justifyContent = 'space-between';
        viewContainer.style.alignItems = 'center';
        viewContainer.style.marginBottom = '10px';

        const viewButton = document.createElement('button');
        viewButton.textContent = viewName;
        viewButton.addEventListener('click', () => {
            const viewData = views[viewName];
            if (viewData && viewData.searchQuery) {
                searchBox.value = viewData.searchQuery; // 検索ボックスに反映
                filterTasks(viewData.searchQuery);     // 検索条件で絞り込み
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => {
            if (confirm(`ビュー「${viewName}」を削除しますか？`)) {
                deleteView(viewName).then(() => {
                    loadViews((updatedViews) => {
                        renderViewList(viewListElement, updatedViews, onViewClick);
                    });
                });
            }
        });

        viewContainer.appendChild(viewButton);
        viewContainer.appendChild(deleteButton);
        viewListElement.appendChild(viewContainer);
    }
};
