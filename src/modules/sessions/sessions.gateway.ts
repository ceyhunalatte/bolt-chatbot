import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinSessionDto } from './dto/joinSessionDto.dto';
import { SessionsService } from './sessions.service';
import { WsAuthGuard } from '../auth/auth.guard';

interface SocketWithUser extends Socket {
  user: {
    id: string;
  };
}

/**
 * Session socket service as gateway.
 */
@WebSocketGateway({ cors: '*:*', namespace: 'session' })
@UseGuards(WsAuthGuard)
export class SessionsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private sessionsService: SessionsService) {}

  handleConnection(client: Socket) {
    console.log('client connected');
  }

  @SubscribeMessage('joinSession')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinSessionDto,
  ) {
    client.join(dto.sessionId);
    this.server
      .to(dto.sessionId)
      .emit('joinedToSession', `Succesfully joined to ${dto.sessionId}`);
  }

  @SubscribeMessage('newMessage')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { message: string; sessionId: string; user: any },
  ) {
    const message = await this.sessionsService.sendMessage({
      message: data.message,
      sessionId: data.sessionId,
      owner: client.data.user.id,
      role: 'USER',
    });

    if (!message) return;
    this.server.to(data.sessionId).emit('newMessage', message);

    const response = await this.sessionsService.respondToUser(data.sessionId);
    this.server.to(data.sessionId).emit('newMessage', response);
  }

  emitMessage(roomId: string, type: string, data: Record<string, any>) {
    this.server.to(roomId).emit(type, data);
  }
}
