// コレクションを定義します

import * as admin from 'firebase-admin';
const store = admin.firestore();
export const COLLECTION_USERS = store.collection('users');
export const COLLECTION_BLOGPOSTS = store.collection('blogPosts');
export const COLLECTION_CONTACTS = store.collection('contacts');
export const COLLECTION_ENTITIES = store.collection('entities');
export const COLLECTION_POSTCOMMENTS = store.collection('postComments');
