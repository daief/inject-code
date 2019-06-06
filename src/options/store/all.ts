import { Log } from '@/common/log';
import { FileSet } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const all = extendModel<{
  fileSetList: FileSet[];
}>({
  name: 'all',
  state: {
    fileSetList: [],
  },
  effects: dispatch => {
    return {
      async getFileSetList(payload, rootState, { $db }) {
        const list = await $db.getFileSetList();
        dispatch.all.setState({ fileSetList: list });
        return list;
      },
      async getSourceFileListByIds(payload, _, { $db }) {
        return $db.getSourceFileListByIds(payload);
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
