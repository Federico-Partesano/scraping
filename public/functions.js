"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInitialStatesElecttron = void 0;
const typings_1 = require("./typings");
const states = {
    favoritesSongs: (store) => {
        const favorites = store.get(typings_1.KEYS_STORE.FAVORITE_SONGS);
        if (!Array.isArray(favorites))
            store.set(typings_1.KEYS_STORE.FAVORITE_SONGS, []);
    },
};
const setInitialStatesElecttron = (store) => {
    Object.values(states).forEach((setState) => {
        setState(store);
    });
};
exports.setInitialStatesElecttron = setInitialStatesElecttron;
