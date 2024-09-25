import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { JoinSessionDto } from './dto/joinSessionDto';

/**
 * Session socket service as gateway.
 */
@WebSocketGateway({ cors: '*:*', namespace: 'session' })
// @UseGuards(AuthGuard)
export class SessionsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('client connected');
  }

  @SubscribeMessage('joinSession')
  // @UseGuards(AuthGuard)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    // @MessageBody() dto: JoinSessionDto,
  ) {
    // client.join(dto.sessionId);
    // setTimeout(() => {
    //   this.server
    //     .to(dto.sessionId)
    //     .emit('joinedToSession', `Succesfully joined to ${dto.sessionId}`);
    // }, 3000);
  }

  @SubscribeMessage('send_message')
  // @UseGuards(AuthGuard)
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string; room: string },
  ) {}
}
