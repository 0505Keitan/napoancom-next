import { Entity } from '../entities/Entity';

export interface UserDoc {
  jewel: number;
}

export interface UserResult extends UserDoc {
  entities: Entity[];
  message: string;
}
