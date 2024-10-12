export type JWT = {
  token: string;
};
export type JWTPayload = {
  username: string;
  id: string;
  iat: number;
  exp: number;
};
export enum ChatRoles {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  BOT = 'CHATBOT',
}
