import { GeTableResult } from '@/models/entityatsume/Entity';
import switchStagingApi from './common/switchStagingApi';

const getGeTable = async (useStaging: boolean): Promise<GeTableResult> => {
  const apiUrl = switchStagingApi(useStaging);

  try {
    let response = await fetch(apiUrl + 'getAll', {
      // BE AWARE:POST
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.FUNCTION_AUTH}`,
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      console.error('Failed to fetch: ' + response.statusText);
      return { message: response.statusText };
    }
  } catch (e) {
    console.error(e);
    return { message: e };
  }
};

export default getGeTable;
