import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { SessionsRepository } from './sessions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/models/session.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, SessionsGateway],
})
export class SessionsModule {}
