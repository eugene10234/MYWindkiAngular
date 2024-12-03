export interface Message {
  FMessId: number;
  FMemberId: string;
  FSId: string;
  FRId: string;
  FMessContent: string;
  FTimestamp: Date;
  FImagePath?: string;
  FImageName?: string;
  FMessType: string;
  FIsRead: boolean;
  FCreateTime: Date;
  FUpdateTime?: Date;
  userAvatar?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  messages: Message[];
}
