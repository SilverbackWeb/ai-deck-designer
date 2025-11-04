
export enum AppState {
    UPLOADING = 'UPLOADING',
    GENERATING = 'GENERATING',
    DESIGNING = 'DESIGNING',
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

export interface GeneratedStyle {
    style: string;
    imageUrl: string;
}
