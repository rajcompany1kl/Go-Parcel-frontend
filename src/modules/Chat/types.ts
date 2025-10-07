export interface PendingUser {
  userId: string;
  userName: string;
  trackingId: string;
}

export interface Message {
  sender: string;
  text: string;
}

export interface ChatStartedPayload {
  roomId: string;
  userId: string;
}

export interface ReceiveMessagePayload extends Message {}

export interface ChatEndedPayload {
  by?: string;
}