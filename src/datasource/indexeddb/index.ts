import {
  ID,
  MATCH_TYPE,
  RUN_AT,
  SOURCE_TYPE,
  STATUS,
} from '@/interfaces/entities';
import { IDatasource } from '../api';

let instance: IDatasource;

export class InsertCodeDB implements IDatasource {
  public static getInstance(): IDatasource {
    if (!instance) {
      instance = new InsertCodeDB();
    }
    return instance;
  }

  constructor() {
    //
  }

  public async getFileSetList() {
    return [
      {
        id: 1,
        name: 'dddd',
        sourceFileIds: [1, 2, 3],
        status: STATUS.ENABLE,
        ruleIds: [],
        ruleList: [
          {
            id: 1,
            FilesSetId: 1,
            regexContent: 'qa.m',
            status: STATUS.ENABLE,
            matchType: MATCH_TYPE.DOMAIN,
          },
        ],
      },
    ];
  }

  public async getSourceFileListByIds(ids: ID | ID[]) {
    const fake = [
      {
        id: 1,
        sourceType: SOURCE_TYPE.CSS,
        content: `
          body {
            background: #66ccff4d !important;
          }
        `,
        status: STATUS.ENABLE,
        runAt: RUN_AT.DOCUMENT_START,
      },
      {
        id: 2,
        sourceType: SOURCE_TYPE.JS,
        content: `console.log('Injected code 1')`,
        status: STATUS.ENABLE,
        runAt: RUN_AT.DOCUMENT_START,
      },
      {
        id: 3,
        sourceType: SOURCE_TYPE.JS,
        content: `console.log('Injected code 2')`,
        status: STATUS.ENABLE,
        runAt: RUN_AT.DOCUMENT_START,
      },
    ];
    return fake.filter(_ => [ids].flat().includes(_.id));
  }
}
