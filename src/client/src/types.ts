export type User = {
  name: string;
};
export type JWTPayload = {
  token: string;
};
export type Session = {
  _id: string;
  createdAt: Date;
};
export type Message = {
  _id: string;
  sessionId: string;
  role: string;
  message: string;
};