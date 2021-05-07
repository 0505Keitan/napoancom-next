import {
  Entity,
  entityatsumeOptions,
  GroupedEntities,
  RarelityAndProb,
  Table,
} from '../../models/entities/Entity';

// 参考: https://qiita.com/41semicolon/items/9d4d200c14b09cb28fd9

// ここで確率を定義します
const ENTITYATSUME_OPTIONS: entityatsumeOptions = {
  weights: [
    [0, 12],
    [1, 6],
    [2, 3],
    [3, 2],
    [4, 1],
    [5, 0.5],
    [6, 0.1],
    [7, 0.05],
  ],
  pickup: [['ender_dragon', 0.5]],
};

const getRarelityById = (entites: Entity[], id: string) => {
  const target = entites.find((e) => e.bedrockId === id);
  if (target) return target.rarelity;
  throw new Error(`Pickup id doesn't match any of entities`);
};

export const getGroupedEntities = (entities: Entity[]) => {
  const groupedEntities: any[] = [];
  const { weights, pickup } = ENTITYATSUME_OPTIONS;

  weights.forEach(([rarelity, prob]: RarelityAndProb) => {
    const ids = entities.filter((e) => e.rarelity === rarelity).map((e) => e.bedrockId);

    // x[0]はピックアップ対象に指定したエンティティのID
    // getRarelityByIdが実際のデータのレアリティを返し、合致したらオプションの中に格納します
    const pickups = pickup.filter((x) => getRarelityById(entities, x[0]) === rarelity);

    groupedEntities.push({ rarelity, prob, pickups, ids });
  });

  return groupedEntities as GroupedEntities;
};

export const getGachaTable = (ge: GroupedEntities) => {
  const table: Table = [];
  for (const entry of ge) {
    const pickupprob = entry.pickups.reduce((acc, x) => acc - x[1], 1);
    // ピックアップされたやつの確率の総和
    const sumOfPickup = entry.prob * pickupprob;

    // ピックアップされてない奴らの数
    const nonPickupEntityCount = entry.ids.length - entry.pickups.length;
    // ピックアップされてない奴の確率
    const nonPickProb = sumOfPickup / nonPickupEntityCount;

    for (const bedrockId of entry.ids) {
      // x[0]がID
      const searched = entry.pickups.find((x) => x[0] === bedrockId);
      const prob = searched ? entry.prob * searched[1] : nonPickProb;

      table.push([bedrockId, prob, entry.rarelity]);
    }
  }
  return table as Table;
};
