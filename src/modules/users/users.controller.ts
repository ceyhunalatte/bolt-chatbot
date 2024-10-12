import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/user.model';
import { JWT } from 'src/types';
import { AuthUser } from './dto/createOrLogin.dto';

interface IUsersController {
  login(body: AuthUser): Promise<{ user: User; access: JWT }>;
}

@Controller('api/users')
export class UsersController implements IUsersController {
  @Inject(UsersService) usersService: UsersService;

  @Post('login')
  login(@Body() body: AuthUser): Promise<{ user: User; access: JWT }> {
    return this.usersService.createOrLogin(body);
  }
}
