import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/user.model';

interface IUsersController {
  login(body: { username: string; password: string }): Promise<User>;
}

@Controller('api/users')
export class UsersController implements IUsersController {
  @Inject(UsersService) usersService: UsersService;

  @Post('login')
  login(@Body() body: { username: string; password: string }): Promise<User> {
    return this.usersService.createOrLogin(body);
  }
}
