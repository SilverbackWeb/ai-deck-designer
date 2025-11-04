
export enum AppState {
    UPLOADING = 'UPLOADING',
    GENERATING = 'GENERATING',
    DESIGNING = 'DESIGNING',
}

export interface Source {
    uri: string;
    title: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
    sources?: Source[];
}

export interface GeneratedStyle {
    style: string;
    imageUrl: string;
}
