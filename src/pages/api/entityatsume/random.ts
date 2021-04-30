// これをクライアント側でやるとCORSエラーになる

import { GachaResult } from '@/models/entityatsume/Entity';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function random(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = (useStaging: boolean) => {
    if (useStaging) {
      return 'http://localhost:5001/napoancom/us-central1/entityatsume-';
    } else {
      return process.env.API_URL + '/entityatsume-';
    }
  };

  const useStaging = req.query.useStaging as string | undefined;

  try {
    const response = await fetch(apiUrl(useStaging === ' true') + 'random', {
      method: 'GET',
      headers: {
        Authorization: `${process.env.FUNCTION_AUTH}`,
      },
    });
    if (response.ok) {
      await response.json().then((data) => {
        return res.status(200).json(data);
      });
    } else {
      console.error('Failed to fetch: ' + response.statusText);
      return res.status(500).json({
        message: response.statusText,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: JSON.stringify(e),
    });
  }
}
