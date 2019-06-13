import { checkRuleListIsMatched } from '@/common/utils';
import { FileSetWithRule, STATUS } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const popup = extendModel<{
  matchedList: FileSetWithRule[];
}>({
  name: 'popup',
  state: {
    matchedList: [],
  },
  effects: dispatch => {
    return {
      async getMatchedSetList(_, __, { $db }) {
        const result: chrome.tabs.Tab[] = await new Promise(resolve => {
          chrome.tabs.query({ active: true, currentWindow: true }, resolve);
        });

        if (!result.length) {
          return;
        }

        const tab = result[0];
        const { url: urlString = DEFINE.FAKE_POPUP_URL } = tab;
        if (!urlString) {
          return;
        }

        const url = new URL(urlString);
        const fileSetList = await $db.getFileSetList();
        const matchedList = fileSetList.filter(({ ruleList }) => {
          return checkRuleListIsMatched(url, ruleList, {
            checkStatus: false,
          });
        });
        // matchedList.sort((a, _) => (a.status === STATUS.ENABLE ? -1 : 1));
        this.setState({ matchedList });
      },
      async toggleSetStatus(item: FileSetWithRule, _, { $db }) {
        const { id, status } = item;
        return $db.updateFileSet({ id, status });
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
