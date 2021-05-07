import { Table } from '../../models/entities/Entity';
// 参考: https://blobfolio.com/2019/randomizing-weighted-choices-in-javascript/
const selectOneFromTable = (table: Table) => {
  let total = 0;
  for (let i = 0; i < table.length; ++i) {
    total += table[i][1];
  }
  const threshold = Math.random() * total;
  total = 0;
  for (let i = 0; i < table.length - 1; ++i) {
    total += table[i][1];

    if (total >= threshold) {
      return table[i];
    }
  }

  return table[table.length - 1];
};

export default selectOneFromTable;
