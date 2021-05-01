import { Entity } from '../../entities/entity';

export interface UserEntity {
  bedrockId: Entity['bedrockId'];
  lastUpdate: string;
}
