import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/session/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
