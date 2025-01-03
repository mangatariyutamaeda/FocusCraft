import { deleteView, loadViews } from './viewsManager.js';

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
    li.setAttribute('data-id', id);

    const taskName = document.createElement('span');
    taskName.textContent = task.text;

    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tag-container');
    if (task.tags) {
        task.tags.forEach((tag) => {
            const tagElement = document.createElement('button');
            tagElement.textContent = tag;
            tagElement.classList.add('tag');
            tagElement.addEventListener('click', () => filterTasksByTag(tag));
            tagContainer.appendChild(tagElement);
        });
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '未完了に戻す' : '完了';
    completeBtn.addEventListener('click', () => onComplete(id));

    const inProgressBtn = document.createElement('button');
    inProgressBtn.textContent = '実施中に設定';
    inProgressBtn.addEventListener('click', () => onInProgress(id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => onDelete(id));

    li.appendChild(taskName);
    li.appendChild(tagContainer);
    li.appendChild(completeBtn);
    li.appendChild(inProgressBtn);
    li.appendChild(deleteBtn);

    return li;
};

let activeTag = null; // 現在選択されているタグを管理

export const filterTasksByTag = (tag) => {
    const tasks = [...document.querySelectorAll('.task-item')]; // すべてのタスク要素を取得

    if (activeTag === tag) {
        // 同じタグをもう一度押した場合、解除
        activeTag = null;
        tasks.forEach((task) => {
            task.style.display = 'flex'; // 全タスクを表示
        });
    } else {
        // 新しいタグを選択
        activeTag = tag;
        tasks.forEach((task) => {
            const tags = task.querySelectorAll('.tag');
            const tagTexts = [...tags].map((t) => t.textContent);
            if (tagTexts.includes(tag)) {
                task.style.display = 'flex'; // タグが一致するタスクを表示
            } else {
                task.style.display = 'none'; // タグが一致しないタスクを非表示
            }
        });
    }
};

export const renderViewList = (viewListElement, views, onViewClick) => {
    viewListElement.innerHTML = ''; // リストをリセット

    if (!views || typeof views !== 'object') {
        console.error('Invalid views data:', views); // デバッグ: 無効なデータ
        return;
    }

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

        // 削除処理
        deleteButton.addEventListener('click', () => {
            deleteView(viewName).then(() => {
                loadViews((updatedViews) => {
                    renderViewList(viewListElement, updatedViews, searchBox, onViewClick);
                 });
            });
        });

        viewContainer.appendChild(viewButton);
        viewContainer.appendChild(deleteButton);
        viewListElement.appendChild(viewContainer);
    }
};
