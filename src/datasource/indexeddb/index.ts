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
import { IDatasource } from '../api';

let instance: InsertCodeDB;

export class InsertCodeDB extends Dexie implements IDatasource {
  public static getInstance(): InsertCodeDB {
    if (!instance) {
      instance = new InsertCodeDB();
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
  }): Promise<FileSetWithRule[]> {
    const { status } = { status: '', ...query };
    const setList: FileSetWithRule[] = (await (status
      ? this.tableFileSet.where({ status })
      : this.tableFileSet
    ).toArray()) as any;

    await Promise.all(
      setList.map(async fileSet => {
        fileSet.ruleList = await this.tableRule
          .where('id')
          .anyOf(fileSet.ruleIds)
          .toArray();
      }),
    );

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

  public async updateFileSet(fileSet: FileSet) {
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
    return this.TableFileSet.delete(id);
  }

  public clearAll() {
    return Promise.all([
      this.tableFileSet.clear(),
      this.tableRule.clear(),
      this.tableSourceFile.clear(),
    ]);
  }
}
