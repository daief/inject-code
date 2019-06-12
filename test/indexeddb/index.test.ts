/**
 * try some simple unit testing for practice
 */
import { InjectCodeDB } from '@/datasource/indexeddb';
import {
  FileSet,
  MATCH_TYPE,
  Rule,
  RUN_AT,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';

describe('indexeddb', () => {
  describe('only one instance', () => {
    it('check indexeddb instance', () => {
      expect(InjectCodeDB.getInstance()).toEqual(InjectCodeDB.getInstance());
    });
  });

  describe('api it', () => {
    const db = InjectCodeDB.getInstance();

    beforeEach(async done => {
      await db.clearAll();
      done();
    });

    it('clearAll', async done => {
      // @ts-ignore
      await db.TableFileSet.add({
        name: 'fake_set_name',
      });
      expect(await db.TableFileSet.count()).toBe(1);
      await db.clearAll();
      expect(await db.TableFileSet.count()).toBe(0);
      done();
    });

    it('getFileSetList - witout param', async done => {
      const fakeFileSet: FileSet = {
        id: 1,
        name: 'name',
        sourceFileIds: [],
        status: STATUS.DISABLE,
        ruleIds: [1],
      };
      const fakeRule: Rule = {
        id: 1,
        filesSetId: 1,
        regexContent: '',
        status: STATUS.ENABLE,
        matchType: MATCH_TYPE.ALL,
      };
      await db.TableFileSet.add(fakeFileSet);
      await db.TableRule.add(fakeRule);
      const result = await db.getFileSetList();
      expect(result.length).toBe(1);
      expect(result[0].ruleIds.length).toBe(1);
      expect(result[0].ruleList.length).toBe(1);
      done();
    });

    it('getFileSetList - with param `status` & `name`', async done => {
      const set1: FileSet = {
        id: 1,
        name: 'name1',
        sourceFileIds: [],
        status: STATUS.DISABLE,
        ruleIds: [],
      };
      const set2: FileSet = {
        id: 2,
        name: 'name2',
        sourceFileIds: [],
        status: STATUS.DISABLE,
        ruleIds: [],
      };
      await Promise.all([db.TableFileSet.add(set1), db.TableFileSet.add(set2)]);
      const [
        enableResult,
        disableResult,
        withNameList1,
        withNameList2,
        withNameList3,
      ] = await Promise.all([
        db.getFileSetList({ status: STATUS.ENABLE }),
        db.getFileSetList({ status: STATUS.DISABLE }),
        db.getFileSetList({ status: STATUS.ENABLE, name: 'name1' }),
        db.getFileSetList({ status: STATUS.DISABLE, name: 'name1' }),
        db.getFileSetList({ name: 'name' }),
      ]);
      expect(enableResult.length).toBe(0);
      expect(disableResult.length).toBe(2);
      expect(withNameList1.length).toBe(0);
      expect(withNameList2.length).toBe(1);
      expect(withNameList3.length).toBe(2);
      done();
    });

    it('getSourceFileListByIds', async done => {
      const s1: SourceFile = {
        id: 1,
        sourceType: SOURCE_TYPE.CSS,
        content: '',
        status: STATUS.ENABLE,
        runAt: RUN_AT.DOCUMENT_END,
      };
      const s2: SourceFile = {
        id: 2,
        sourceType: SOURCE_TYPE.CSS,
        content: '',
        status: STATUS.ENABLE,
        runAt: RUN_AT.DOCUMENT_END,
      };
      await db.TableSourceFile.add(s1);
      await db.TableSourceFile.add(s2);
      const [r1, r2, r3, r4] = await Promise.all([
        db.getSourceFileListByIds([]),
        db.getSourceFileListByIds(1),
        db.getSourceFileListByIds([2]),
        db.getSourceFileListByIds([1, 2, 3]),
      ]);
      expect(r1.length).toBe(0);
      expect(r2.length).toBe(1);
      expect(r3.length).toBe(1);
      expect(r4.length).toBe(2);
      done();
    });

    it('addNewFileSet', async done => {
      const name = 'file-set-name';
      await db.addNewFileSet({
        id: 1,
        name,
      });
      const result = await db.TableFileSet.where('id')
        .equals(1)
        .toArray();
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe(name);
      expect(result[0].status).toBe(STATUS.ENABLE);
      expect(result[0].ruleIds).toBeInstanceOf(Array);
      expect(result[0].sourceFileIds).toBeInstanceOf(Array);
      done();
    });
  });
});
