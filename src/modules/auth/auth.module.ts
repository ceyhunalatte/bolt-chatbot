import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { dbUrl, defaultJwtExpiration, jwtSecret } from 'src/constants';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
