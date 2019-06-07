import { Log } from '@/common/log';
import { FileSet, FileSetWithRule } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const all = extendModel<{
  fileSetList: FileSetWithRule[];
}>({
  name: 'all',
  state: {
    fileSetList: [],
  },
  effects: dispatch => {
    return {
      async getFileSetList(payload = {}, rootState, { $db }) {
        const { status } = payload;
        const list = await $db.getFileSetList({ status });
        this.setState({ fileSetList: list });
        return list;
      },
      async addNewFileSet(payload, _, { $db }) {
        return $db.addNewFileSet(payload);
      },
      async updateFileSet(payload, _, { $db }) {
        const { fileSetList } = _.all;
        const count = await $db.updateFileSet(payload);
        const index = fileSetList.findIndex(__ => __.id === payload.id);
        if (count && index > -1) {
          fileSetList[index] = {
            ...fileSetList[index],
            ...payload,
          };
          this.setState({ fileSetList: [...fileSetList] });
        }
      },
      async deleteFileSet(payload, _, { $db }) {
        await $db.deleteFileSet(payload.id);
        await this.getFileSetList();
      },
    };
  },
  reducers: {
    setState(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
