
// Define types for messages and socket events
export interface Message  {
  sender: string;
  text: string;
};

export interface ChatStartedPayload  {
  roomId: string;
  adminId: string;
  adminName?: string;
};

export interface ChatEndedPayload  {
  by?: string;
};

export interface SendMessagePayload  {
  roomId: string;
  sender: 'user' | 'admin';
  text: string;
};

export interface EndChatPayload  {
  roomId: string;
  by: string;
};

// Type for URL params
export interface RouteParams  {
  userId: string;
};