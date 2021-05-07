import getPostAndMorePosts from './getPostAndMorePosts';
import getPreviewPost from './getPreviewPost';
import getAllPostsForRss from './getAllPostsForRss';
import getAllPostsWithSlugOnlySlug from './getAllPostsWithSlugOnlySlug';
import getAllPostsByRange from './getAllPostsByRange';

exports.getPostAndMorePosts = getPostAndMorePosts;
exports.getPreviewPost = getPreviewPost;

// 一覧
exports.getAllPostsForRss = getAllPostsForRss;
exports.getAllPostsWithSlugOnlySlug = getAllPostsWithSlugOnlySlug;
exports.getAllPostsByRange = getAllPostsByRange;

// PLATFORM
import getAllPlatformsWithSlug from './getAllPlatformsWithSlug';
import getPlatform from './getPlatform';
import getAllPostsForPlatform from './getAllPostsForPlatform';
exports.getAllPlatformsWithSlug = getAllPlatformsWithSlug;
exports.getPlatform = getPlatform;
exports.getAllPostsForPlatform = getAllPostsForPlatform;

// PERSON
import getAllPersonsWithSlug from './getAllPersonsWithSlug';
import getPerson from './getPerson';
import getAllPostsForPerson from './getAllPostsForPerson';
exports.getAllPersonsWithSlug = getAllPersonsWithSlug;
exports.getPerson = getPerson;
exports.getAllPostsForPerson = getAllPostsForPerson;

// GAME
import getAllGamesWithSlug from './getAllGamesWithSlug';
import getGame from './getGame';
import getAllPostsForGame from './getAllPostsForGame';
exports.getAllGamesWithSlug = getAllGamesWithSlug;
exports.getGame = getGame;
exports.getAllPostsForGame = getAllPostsForGame;
