import * as admin from 'firebase-admin';
admin.initializeApp();

exports.contentful = require('./contentful');
exports.contentfulExport = require('./contentfulexport');
exports.postComments = require('./postComments');
