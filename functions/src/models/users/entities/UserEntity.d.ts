import { Entity } from '../../entities/Entity';

export interface UserEntity {
  bedrockId: Entity['bedrockId'];
  lastUpdate: string;
}
