import { checkRuleListIsMatched } from '@/common/utils';
import { ID, STATUS } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';

export const background = extendModel<{}>({
  name: 'background',
  state: {},
  // tslint:disable-next-line: variable-name
  effects: _dispatch => {
    return {
      async getInjectedAbleSourceFileList(
        payload: {
          url: URL;
        },
        __,
        { $db },
      ) {
        const { url } = payload;

        const fileSetList = await $db.getFileSetList({
          status: STATUS.ENABLE,
        });

        const sourceFileIds: ID[] = fileSetList
          .filter(({ ruleList }) =>
            checkRuleListIsMatched(url, ruleList, { checkStatus: true }),
          )
          .flatMap(_ => _.sourceFileIds);

        return $db.getSourceFileListByIds(sourceFileIds);
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
