import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/user.model';
import { JWTPayload } from 'src/types';
import { CreateOrLoginDto } from './dto/createOrLogin.dto';

interface IUsersController {
  login(body: CreateOrLoginDto): Promise<{ user: User; access: JWTPayload }>;
}

@Controller('api/users')
export class UsersController implements IUsersController {
  @Inject(UsersService) usersService: UsersService;

  @Post('login')
  login(
    @Body() body: CreateOrLoginDto,
  ): Promise<{ user: User; access: JWTPayload }> {
    return this.usersService.createOrLogin(body);
  }
}
