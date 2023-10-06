export enum KEYS_STORE {
    FAVORITE_SONGS = "favoritesSongs"
}


export interface Data {
  ID: number
  "Nome e Cognome ": string
  "E-mail": string
  Domicilio: string
  "Area Aziendale": string
  CV: string
  "Data Ultima Modifica": string
  "Data&nbsp;Colloquio": string
  "Data Inserimento Valutazione": string
  "Data Ultima&nbsp;Modifica  Valutazione": string
}


export interface IStore {
    file: string
}