import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const contentfulExport = require('contentful-export');
const adminConfig = functions.config() as AdminConfig;

// ストレージのファイル名に使う
const serverDate =
  new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-') +
  new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo' }).replace(/\s/g, '-').replace(/:/g, '-');

// バックアップ対象のストレージ
const { Storage } = require('@google-cloud/storage');
const local_backup_path = '/tmp/';
const storage = new Storage();
const bucketName = 'napoancom.appspot.com';
const fileName = 'contentfulbackup-' + serverDate + '.json';

const options = {
  // https://github.com/contentful/contentful-export
  spaceId: adminConfig.contentful.space,
  managementToken: adminConfig.contentful.manage,
  contentFile: fileName,
  exportDir: local_backup_path,
  useVerboseRenderer: false,
  saveFile: true,
};
const runtimeOpts = {
  timeoutSeconds: 540,
};

// https://www.contentful.com/blog/2019/05/15/configuring-automatic-backups-for-contentful/

async function uploadFile(path: string) {
  await storage.bucket(bucketName).upload(path, {
    destination: 'contentful/' + fileName,
  });

  console.log(`${fileName} uploaded to ${bucketName}`);
  return;
}

// 月曜0時にエクスポート
exports.exportOnSchedule = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .pubsub.schedule('0 0 * * 0')
  .timeZone('Asia/Tokyo')
  .onRun(async (context: any) => {
    functions.logger.info('AUTOMATICALLY STARTED CONTENTFUL EXPORT SCRIPT');
    functions.logger.info('File name: ' + fileName);

    try {
      await contentfulExport(options).then((res: any) => {
        functions.logger.info('Space json data has been downloaded');
        functions.logger.info('Preparing json file for Cloud Storage');
        const outputFile = local_backup_path + fileName;

        uploadFile(outputFile).then(() => {
          return functions.logger.info(`Export complete (${outputFile})`);
        });
      });
    } catch (err) {
      functions.logger.error('Error occured during export', err);
    }
  });
