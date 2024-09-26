import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { SessionsRepository } from './sessions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/models/session.model';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MessagesModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsGateway, SessionsRepository, SessionsService],
})
export class SessionsModule {}
