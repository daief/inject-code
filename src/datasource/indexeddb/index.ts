import { Log } from '@/common/log';
import { MissingError } from '@/common/MisingError';
import {
  FileSet,
  FileSetWithRule,
  ID,
  MATCH_TYPE,
  Rule,
  RUN_AT,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { PartialKeys } from '@/interfaces/utils';
import Dexie from 'dexie';

let instance: InjectCodeDB;

export class InjectCodeDB extends Dexie {
  public static getInstance(): InjectCodeDB {
    if (!instance) {
      instance = new InjectCodeDB();
    }
    return instance;
  }

  private tableFileSet: Dexie.Table<FileSet, ID>;
  private tableSourceFile: Dexie.Table<SourceFile, ID>;
  private tableRule: Dexie.Table<Rule, ID>;

  constructor() {
    super('InsertCodeDB');

    this.version(1).stores({
      tableFileSet: '++id,name,sourceFileIds,status,ruleIds',
      tableSourceFile: '++id,sourceType,content,status,runAt',
      tableRule: '++id,filesSetId,regexContent,status,matchType',
    });
    this.tableFileSet = this.table('tableFileSet');
    this.tableSourceFile = this.table('tableSourceFile');
    this.tableRule = this.table('tableRule');
  }

  public get TableFileSet() {
    return this.tableFileSet;
  }

  public get TableSourceFile() {
    return this.tableSourceFile;
  }

  public get TableRule() {
    return this.tableRule;
  }

  public async getFileSetList(query?: {
    status?: STATUS;
    name?: string;
  }): Promise<FileSetWithRule[]> {
    query = { status: undefined, name: undefined, ...query };

    const getRegex = str => (str ? new RegExp(str, 'i') : false);

    const keys = ['status', 'name'];
    const regexMap: Record<string, false | RegExp> = {};
    keys.map(key => (regexMap[key] = getRegex(query[key])));

    const setList: FileSetWithRule[] = (await this.tableFileSet
      .filter(row => {
        let flag = true;
        for (const key of keys) {
          // @ts-ignore
          flag = regexMap[key] ? regexMap[key].test(row[key]) : true;

          if (flag === false) {
            return false;
          }
        }
        return flag;
      })
      .toArray()) as any;

    await Promise.all(
      setList.map(async fileSet => {
        fileSet.ruleList = await this.tableRule
          .where('id')
          .anyOf(fileSet.ruleIds)
          .toArray();
      }),
    );

    Log.Debug('getFileSetList result with query', query, setList);

    return setList;
  }

  public async getSourceFileListByIds(ids: ID | ID[]) {
    const flatIds = [ids].flat().filter(Boolean);
    return this.tableSourceFile
      .where('id')
      .anyOf(flatIds)
      .toArray();
  }

  public async addNewFileSet(
    fileSet: PartialKeys<
      FileSet,
      'id' | 'ruleIds' | 'sourceFileIds' | 'status'
    >,
  ) {
    // @ts-ignore id optional
    return this.tableFileSet.add({
      status: STATUS.ENABLE,
      ruleIds: [],
      sourceFileIds: [],
      ...fileSet,
    });
  }

  public async addNewRule(
    rule: PartialKeys<Rule, 'status' | 'regexContent' | 'id' | 'matchType'>,
  ) {
    // @ts-ignore id optional
    return this.tableRule.add({
      matchType: MATCH_TYPE.DOMAIN,
      regexContent: '',
      status: STATUS.ENABLE,
      ...rule,
    });
  }

  public async addNewSourceFile(
    rule: PartialKeys<SourceFile, 'status' | 'content' | 'id' | 'runAt'>,
  ) {
    // @ts-ignore id optional
    return this.tableSourceFile.add({
      runAt: RUN_AT.DOCUMENT_IDLE,
      content: '',
      status: STATUS.ENABLE,
      ...rule,
    });
  }

  public async updateFileSet(fileSet: Partial<FileSet> & { id: ID }) {
    const { id, ...rest } = fileSet;
    if (!id) {
      throw new MissingError();
    }
    return this.TableFileSet.update(id, { ...rest });
  }

  public async deleteFileSet(id: ID) {
    if (!id) {
      throw new MissingError();
    }
    return this.transaction(
      'rw',
      this.tableFileSet,
      this.tableRule,
      this.tableSourceFile,
      async () => {
        const set = await this.tableFileSet.get(id);
        await this.tableRule
          .where('id')
          .anyOf(set.ruleIds)
          .delete();
        await this.tableSourceFile
          .where('id')
          .anyOf(set.sourceFileIds)
          .delete();
        await this.tableFileSet.delete(id);
      },
    );
  }

  public clearAll() {
    return Promise.all([
      this.tableFileSet.clear(),
      this.tableRule.clear(),
      this.tableSourceFile.clear(),
    ]);
  }
}
