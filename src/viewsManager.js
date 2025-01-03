import { database, ref, set, onValue } from './firebase.js';

// ビューを保存
export const saveView = (viewName, tasks) => {
    return set(ref(database, `views/${viewName}`), tasks);
};

// ビューを取得してリスト表示
export const loadViews = (callback) => {
    if (typeof callback !== 'function') {
        console.error('Invalid callback passed to loadViews:', callback);
        return;
    }

    onValue(ref(database, 'views'), (snapshot) => {
        const views = snapshot.val();
        callback(views);
    });
};

// ビューを削除する関数
export const deleteView = (viewName) => {
    return remove(ref(database, `views/${viewName}`));
};
