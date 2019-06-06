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
  getFileSetList(query?: { status: STATUS }): Promise<FileSetWithRule[]>;
  getSourceFileListByIds(id: ID | ID[]): Promise<SourceFile[]>;
}
