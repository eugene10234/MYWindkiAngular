import { Message } from "../../models/chat.interface";

export interface ChatResponse {
  messages: Message[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
