import { database, ref, set, onValue } from './firebase.js';

export const saveView = (viewName, tasks) => {
    return set(ref(database, `views/${viewName}`), tasks);
};

export const loadViews = (callback) => {
    onValue(ref(database, 'views'), (snapshot) => {
        const views = snapshot.val();
        callback(views);
    });
};
