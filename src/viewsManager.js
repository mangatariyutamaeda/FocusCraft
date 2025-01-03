import { database, ref, set, onValue, remove } from './firebase.js';

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

    const viewsRef = ref(database, 'views');
    onValue(viewsRef, (snapshot) => {
        const views = snapshot.val() || {}; // データが null の場合は空オブジェクトを返す
        callback(views);
    }, (error) => {
        console.error('Error fetching views:', error);
    });
};

// ビューを削除する関数
export const deleteView = (viewName) => {
    return remove(ref(database, `views/${viewName}`));
};
