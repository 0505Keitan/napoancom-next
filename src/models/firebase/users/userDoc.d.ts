import { Entity } from '../entities/entity';

export interface UserDoc {
  jewel: number;
}
export interface UserResult extends UserDoc {
  entities: Entity[];
  message: string;
}
