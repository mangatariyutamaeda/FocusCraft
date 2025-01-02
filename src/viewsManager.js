import { database, ref, set, onValue } from './firebase.js';

// ビューを保存
export const saveView = (viewName, tasks) => {
    return set(ref(database, `views/${viewName}`), tasks);
};

// ビューを取得してリスト表示
export const loadViews = (callback) => {
    onValue(ref(database, 'views'), (snapshot) => {
        const views = snapshot.val();
        callback(views);
    });
};
