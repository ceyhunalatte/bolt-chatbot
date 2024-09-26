import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [SessionsModule, MessagesModule],
  providers: [],
})
export class ChatModule {}
