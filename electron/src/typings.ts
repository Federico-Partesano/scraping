export enum KEYS_STORE {
    FAVORITE_SONGS = "favoritesSongs"
}

export interface IStore {
    favoritesSongs: string[],
    folder: string
}