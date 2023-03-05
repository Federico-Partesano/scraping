export interface Thumbnail2 {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnail {
  thumbnails: Thumbnail2[];
}

export interface WebCommandMetadata {
  url: string;
  webPageType: string;
  rootVe: number;
  apiUrl: string;
}

export interface CommandMetadata {
  webCommandMetadata: WebCommandMetadata;
}

export interface BrowseEndpoint {
  browseId: string;
  canonicalBaseUrl: string;
}

export interface NavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  browseEndpoint: BrowseEndpoint;
}

export interface Run {
  text: string;
  navigationEndpoint: NavigationEndpoint;
}

export interface ShortBylineText {
  runs: Run[];
}

export interface AccessibilityData {
  label: string;
}

export interface Accessibility {
  accessibilityData: AccessibilityData;
}

export interface Length {
  accessibility: Accessibility;
  simpleText: string;
}

export interface RespVideoSearch {
  id: string;
  type: string;
  thumbnail: Thumbnail;
  title: string;
  channelTitle: string;
  shortBylineText: ShortBylineText;
  length: Length;
  isLive: boolean;
}
