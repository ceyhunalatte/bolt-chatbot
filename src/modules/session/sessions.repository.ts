import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument, Session } from '../../models/session.model';

export interface ISessionsRepository {
  findById(id: string): Promise<SessionDocument | null>;
  create(data: { owner: string }): Promise<SessionDocument>;
  update(id: string, session: Session): Promise<SessionDocument | null>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async findById(_id: string): Promise<SessionDocument | null> {
    return this.sessionModel.findById(_id);
  }

  async create(data: { owner: string }): Promise<SessionDocument> {
    return this.sessionModel.create(data);
  }

  async update(id: string, session: Session): Promise<SessionDocument | null> {
    return this.sessionModel.findByIdAndUpdate(id, session, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.sessionModel.findByIdAndDelete(id);
  }
}
