export interface ISong {
    id: string,
    videoId: string,
    image: string,
    title: string,
    description: string,
    status: "ok" | "processing" | "error" | "converting",
  
}

export type IRespYoutubeLibrary = ISong[];


export type IRespYoutubeLibraryMapped = (ISong & {
    percentual: null | number,
});

