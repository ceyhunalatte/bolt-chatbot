import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  Session,
  SessionDocument,
  SessionSchema,
} from 'src/models/session.model';

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

export class UpdatebyIdto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  session: Session;
}
