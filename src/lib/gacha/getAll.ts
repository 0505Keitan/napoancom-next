import { EntitiesResult } from '@/models/entityatsume/Entity';
import switchStagingApi from './common/switchStagingApi';

// これはgetStaticPropsで使われる
const getAll = async (useStaging: boolean): Promise<EntitiesResult> => {
  const apiUrl = switchStagingApi(useStaging);

  try {
    let response = await fetch(apiUrl + 'getAll', {
      method: 'GET',
      headers: {
        Authorization: `${process.env.FUNCTION_AUTH}`,
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      console.error('Failed to fetch: ' + response.status);
      return { entities: [], message: response.statusText };
    }
  } catch (e) {
    console.error(e);
    return { entities: [], message: e };
  }
};

export default getAll;
