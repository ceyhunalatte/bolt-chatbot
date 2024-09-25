import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../auth/auth.guard';

@WebSocketGateway({ cors: '*:*', namespace: 'session' })
@UseGuards(AuthGuard)
export class SessionsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_session')
  @UseGuards(AuthGuard)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {}

  @SubscribeMessage('send_message')
  @UseGuards(AuthGuard)
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string; room: string },
  ) {}
}
