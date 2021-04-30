import { Entity, EntityResult } from '@/models/entityatsume/Entity';
import switchStagingApi from './common/switchStagingApi';

const getByBedrockId = async ({
  bedrockId,
  useStaging,
}: {
  bedrockId: string;
  useStaging: boolean;
}): Promise<EntityResult> => {
  const apiUrl = switchStagingApi(useStaging);

  let response = await fetch(apiUrl + 'getByBedrockId?bedrockId=' + bedrockId, {
    method: 'GET',
    headers: {
      Authorization: `${process.env.FUNCTION_AUTH}`,
    },
  });
  if (response.ok) {
    const result = await response.json().then((res) => {
      return res as EntityResult;
    });
    return {
      entity: result.entity,
      message: undefined,
    };
  } else {
    console.error('Failed to fetch: ' + response.statusText);
    return { message: response.statusText };
  }
};

export default getByBedrockId;
