import { extendModel } from '@/interfaces/rematch';
import { message } from 'antd';
import moment from 'moment';

export const model = extendModel({
  name: 'setting',
  state: {},
  effects: dispatch => {
    return {
      async exportData(_, __, { $db }) {
        const hide = message.loading('Now exportting data ...', 0);
        try {
          const [
            TableFileSet,
            TableRule,
            TableSourceFile,
          ] = await $db.transaction('r', $db.tables, async () => {
            return Promise.all([
              $db.TableFileSet.toArray(),
              $db.TableRule.toArray(),
              $db.TableSourceFile.toArray(),
            ]);
          });

          const exportObject: any = {};
          exportObject.name = DEFINE.displayName;
          exportObject.version = DEFINE.version;
          exportObject.TableFileSet = TableFileSet;
          exportObject.TableRule = TableRule;
          exportObject.TableSourceFile = TableSourceFile;
          exportObject.verno = $db.verno;
          const elA = document.createElement<'a'>('a');
          const blob = new Blob([JSON.stringify(exportObject)], {
            type: 'application/json',
          });
          elA.download = `${DEFINE.displayName}-${DEFINE.version}-${
            $db.verno
          }-${moment().format('YYYYMMDDHHmmSS')}.json`;
          elA.href = URL.createObjectURL(blob);
          elA.click();
        } catch (error) {
          message.error('Export error' + error);
        } finally {
          hide();
        }
      },
      async importData(payload, __, { $db }) {
        const { file } = payload;
        const hide = message.loading('Now importting data ...', 0);
        try {
          const fileReader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            fileReader.addEventListener('loadend', () => {
              resolve();
            });

            fileReader.addEventListener('error', () => {
              reject('Read file error');
            });
          });
          fileReader.readAsText(file);
          await promise;

          const importObject: any = JSON.parse(fileReader.result as string);

          //
          // can do some check
          //

          await $db.transaction('rw', $db.tables, async () => {
            return Promise.all([
              $db.TableFileSet.bulkAdd(importObject.TableFileSet),
              $db.TableRule.bulkAdd(importObject.TableRule),
              $db.TableSourceFile.bulkAdd(importObject.TableSourceFile),
            ]);
          });

          message.success('Import done!');
        } catch (error) {
          message.error('Export error' + error);
        } finally {
          hide();
        }
      },
    };
  },
});
