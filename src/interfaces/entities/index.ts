export type ID = string | number;

export enum SOURCE_TYPE {
  JS = 'JS',
  CSS = 'CSS',
}

export enum STATUS {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

export enum RUN_AT {
  DOCUMENT_START = 'document_start',
  DOCUMENT_IDLE = 'document_idle',
  DOCUMENT_END = 'document_end',
}

export interface SourceFile {
  id: ID;
  sourceType: SOURCE_TYPE;
  content: string;
  status: STATUS;
  runAt: RUN_AT;
  // createTime: number;
  // updateTime: number;
}

export enum MATCH_TYPE {
  ALL = 'ALL',
  DOMAIN = 'DOMAIN',
}

export interface Rule {
  id: ID;
  filesSetId: ID;
  regexContent: string;
  status: STATUS;
  matchType: MATCH_TYPE;
}

export interface FileSet {
  id: ID;
  name: string;
  sourceFileIds: ID[];
  status: STATUS;
  ruleIds: ID[];
}

export type FileSetWithRule = FileSet & {
  ruleList: Rule[];
};
