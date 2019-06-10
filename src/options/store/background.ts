import { ID, MATCH_TYPE, STATUS } from '@/interfaces/entities';
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
          .filter(({ ruleList }) => {
            let flag = false;
            // as long as one rule is matched, inject all code of the set
            for (const rule of ruleList) {
              const { regexContent, status, matchType } = rule;
              if (status === STATUS.ENABLE && regexContent) {
                const regex = new RegExp(regexContent, 'ig');
                switch (matchType) {
                  case MATCH_TYPE.ALL:
                    flag = regex.test(url.href);
                    break;
                  case MATCH_TYPE.DOMAIN:
                    flag = regex.test(url.hostname);
                    break;
                }
                if (flag) {
                  break;
                }
              }
            }
            return flag;
          })
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
