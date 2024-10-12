export type User = {
  name: string;
};
export type JWT = {
  token: string;
};
export type Session = {
  _id: string;
  createdAt: Date;
  status: string;
};
export type Message = {
  _id: string;
  sessionId: string;
  role: string;
  message: string;
};
export interface ISessionStatus {
  status?: string;
  message?: Message;
  error?: string;
}