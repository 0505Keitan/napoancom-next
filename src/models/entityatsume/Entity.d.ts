export type Rarelity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RarelityAndProb = [Rarelity, number];
export type IdAndNumber = [string, number];
export type IdAndNumberAndRarelity = [string, number, Rarelity];

export type GroupedEntities = [
  {
    rarelity: Rarelity;
    prob: number;
    pickups: IdAndNumber[];
    ids: string[];
  },
];
export interface entityatsumeOptions {
  weights: Array<RarelityAndProb>;
  pickup: Array<IdAndNumber>;
}

export type Table = Array<IdAndNumberAndRarelity>;

export interface Entity {
  bedrockId: string;
  name: string;
  nameJapanese?: string;
  health?: number;
  iconUrl?: string;
  iconBgPos?: string;
  dec?: number;
  hex?: string;
  pictureUrl?: string;
  description?: string;
  size?: string;
  firstAdded?: string;
  rarelity: Rarelity;
  type?: 'passive' | 'friendly' | 'hostile';
}

export interface GachaResult {
  entity?: Entity;
  prob?: number;
  message?: string;
}

export interface EntitiesResult {
  entities?: Entity[];
  message?: string;
}
export interface EntityResult {
  entity?: Entity;
  message?: string;
}

export interface GeTableResult {
  ge?: GroupedEntities;
  table?: Table;
  message?: string;
}
