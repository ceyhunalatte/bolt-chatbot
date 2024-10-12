import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MessagesModule } from './modules/messages/messages.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/client/build'),
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
