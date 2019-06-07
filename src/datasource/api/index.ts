import {
  FileSet,
  FileSetWithRule,
  ID,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { PartialKeys } from '@/interfaces/utils';
import { InsertCodeDB } from '../indexeddb';

export function getInstance(): IDatasource {
  return InsertCodeDB.getInstance();
}

export interface IDatasource {
  clearAll(): Promise<{}>;
  getFileSetList(query?: { status?: STATUS }): Promise<FileSetWithRule[]>;
  getSourceFileListByIds(id: ID | ID[]): Promise<SourceFile[]>;

  addNewFileSet(
    fileSet: PartialKeys<
      FileSet,
      'id' | 'ruleIds' | 'sourceFileIds' | 'status'
    >,
  ): Promise<ID>;
  updateFileSet(fileSet: PartialKeys<FileSet, 'id'>): Promise<number>;
  deleteFileSet(id: ID): Promise<void>;
}
