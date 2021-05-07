import * as functions from 'firebase-functions';

import { AdminConfig } from '../models/AdminConfig';
import { COLLECTION_POSTCOMMENTS } from '../common/collections';
const adminConfig = functions.config() as AdminConfig;

exports.getCommentsBySlug = functions.https.onRequest((request, response: any) => {
  const secret = request.headers.authorization as string;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }
  const slug = request.query.slug ?? '';

  if (typeof slug !== 'string') {
    functions.logger.error(`Slug is invalid`);
    response.status(500).json({ message: `Slug is invalid` });
  } else {
    if (slug == '') {
      functions.logger.error(`Slug is blank`);
      response.status(500).json({ message: `Slug is blank` });
    } else {
      functions.logger.info(`Slug: ${slug}`);
      COLLECTION_POSTCOMMENTS.where('postSlug', '==', slug)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            response.status(200).json([]);
          } else {
            const array = snapshot.docs.map((doc: any) => {
              const comment = doc.data();
              comment.id = doc.id;
              return comment;
            });
            response.status(200).json(array);
          }
        })
        .catch((e) => functions.logger.error(e));
    }
  }
});
