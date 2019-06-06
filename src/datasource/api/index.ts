import {
  FileSet,
  FileSetWithRule,
  ID,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { InsertCodeDB } from '../indexeddb';

export function getInstance(): IDatasource {
  return InsertCodeDB.getInstance();
}

export interface IDatasource {
  clearAll(): Promise<{}>;
  getFileSetList(query?: { status?: STATUS }): Promise<FileSetWithRule[]>;
  getSourceFileListByIds(id: ID | ID[]): Promise<SourceFile[]>;

  addNewFileSet(fileSet: FileSet): Promise<ID>;
}
