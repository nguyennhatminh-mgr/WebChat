export interface Log {
    id: string;
    displayName: string;
    friendId: string;
    isChatRoom: boolean;
    lastMessage?: string;
    lastUpdated?: number;
    photoUrl?: string;
    roomName?: string;
}
