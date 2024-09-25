import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Session } from 'src/models/session.model';

export class FindOneByOwnerAndUpdateDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  session: Session;
}
