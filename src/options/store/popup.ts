import { checkRuleListIsMatched } from '@/common/utils';
import { FileSetWithRule } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const popup = extendModel<{
  matchedList: FileSetWithRule[];
  url: URL | null;
}>({
  name: 'popup',
  state: {
    matchedList: [],
    url: null,
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
        this.setState({ matchedList, url });
      },
      async toggleSetStatus(item: FileSetWithRule, _, { $db }) {
        const { id, status } = item;
        return $db.updateFileSet({ id, status });
      },
      async addNewSetAndRule(_, rootState, { $db }) {
        const { url } = rootState.popup;
        if (!url) {
          return '';
        }
        return $db
          .transaction('rw', $db.TableFileSet, $db.TableRule, async () => {
            const id = await $db.addNewFileSet({
              name: 'Untitled',
            });
            const ruleId = await $db.addNewRule({
              filesSetId: id,
              regexContent: url.hostname,
            });
            await $db.updateFileSet({
              id,
              ruleIds: [ruleId],
            });
            return id;
          })
          .then(setId => {
            chrome.tabs.create(
              { url: `options.html#/set-detail?id=${setId}` },
              () => {
                /* */
              },
            );
          });
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
