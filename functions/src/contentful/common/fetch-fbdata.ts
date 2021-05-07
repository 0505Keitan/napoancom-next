import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { BlogPostData } from '../../models/BlogPostData';
const firestore = admin.firestore();
const collectionRef = firestore.collection('blogPosts');

// 高評価・低評価はここで取得して返します
const fetchFbdata = async (slug: string) => {
  const result = await collectionRef
    .doc(slug)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data() as BlogPostData;
        functions.logger.info(`Fetched like/dislike data: ${data.like}/${data.dislike}`);
        return {
          like: data.like ?? 0,
          dislike: data.dislike ?? 0,
        };
      } else {
        functions.logger.warn(`Like/dislike data not found`);
        return {
          like: 0,
          dislike: 0,
        } as BlogPostData;
      }
    })
    .catch((e) => functions.logger.error(e));
  return result;
};

export default fetchFbdata;
