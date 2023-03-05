import ElectronStore from "electron-store";
import { IStore, KEYS_STORE } from "./typings";

const states = {
  favoritesSongs: (store: ElectronStore<IStore>) => {
    const favorites = store.get(KEYS_STORE.FAVORITE_SONGS);
    if (!Array.isArray(favorites)) store.set(KEYS_STORE.FAVORITE_SONGS, []);
  },
};

export const setInitialStatesElecttron = (store: ElectronStore<IStore>) => {
  Object.values(states).forEach((setState) => {
    setState(store);
  });
};
