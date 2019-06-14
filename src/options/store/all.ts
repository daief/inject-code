import { getGlobalOptions, setGlobalOptions } from '@/common/utils';
import { ExtensionGlobalOptions, FileSetWithRule } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const all = extendModel<{
  fileSetList: FileSetWithRule[];
  globalOptions: ExtensionGlobalOptions;
}>({
  name: 'all',
  state: {
    fileSetList: [],
    globalOptions: getGlobalOptions(),
  },
  effects: dispatch => {
    return {
      async getFileSetList(payload = {}, rootState, { $db }) {
        const { status, name } = payload;
        const list = await $db.getFileSetList({ status, name });
        this.setState({ fileSetList: list });
        return list;
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
      getGlobalOptions() {
        this.updateGlobalOptions();
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
    updateGlobalOptions(state, payload) {
      setGlobalOptions(payload);
      return {
        ...state,
        globalOptions: getGlobalOptions(),
      };
    },
  },
});
