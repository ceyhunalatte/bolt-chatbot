export type User = {
  name: string;
};
export type JWT = {
  token: string;
};
export type JWTPayload = {
  username: string;
  id: string;
  iat: number;
  exp: number;
};
export type Chat = {
  _id: string;
  createdAt: Date;
  status: string;
};
export type Message = {
  _id: string;
  chatId: string;
  role: string;
  message: string;
};
export interface IChatStatus {
  status?: string;
  message?: Message;
  error?: string;
}