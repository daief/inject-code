import { DATA_IMPORT_EXIST_BEHAVIOR } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';
import { message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import Dexie from 'dexie';
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
          message.error('Export error: ' + error);
        } finally {
          hide();
        }
      },
      async importData(payload, __, { $db }) {
        const { file, behavior } = payload as {
          file: UploadFile;
          behavior: DATA_IMPORT_EXIST_BEHAVIOR;
        };
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
          fileReader.readAsText(file as any);
          await promise;

          const importObject: any = JSON.parse(fileReader.result as string);

          //
          // can do some check
          //

          const addAndUpdate = async (
            items: any[],
            table: Dexie.Table<any, any>,
          ) => {
            return Promise.all(
              items.map(async value => {
                if (!Object.prototype.hasOwnProperty.call(value, 'id')) {
                  return;
                }
                const count = await table.where({ id: value.id }).count();
                if (count) {
                  return behavior === DATA_IMPORT_EXIST_BEHAVIOR.OVERRIDE
                    ? table.update(value.id, value)
                    : undefined;
                }
                return table.add(value);
              }),
            );
          };

          await $db.transaction('rw', $db.tables, async () => {
            return Promise.all([
              addAndUpdate(importObject.TableFileSet, $db.TableFileSet),
              addAndUpdate(importObject.TableRule, $db.TableRule),
              addAndUpdate(importObject.TableSourceFile, $db.TableSourceFile),
            ]);
          });

          message.success('Import done!');
        } catch (error) {
          message.error('Export error: ' + error);
        } finally {
          hide();
        }
      },
    };
  },
});
