import { Log } from '@/common/log';
import { hashHistory } from '@/components/options/RouterLayout';
import { MATCH_TYPE, Rule, STATUS } from '@/interfaces/entities';
import { extendModel } from '@/interfaces/rematch';
import { PartialId } from '@/interfaces/utils';

export const options = extendModel<{
  countOverview: {
    fileSetCount: number;
    sourceFileCount: number;
    ruleCount: number;
  };
}>({
  name: 'options',
  state: {
    countOverview: {
      fileSetCount: 0,
      sourceFileCount: 0,
      ruleCount: 0,
    },
  },
  effects: dispatch => {
    return {
      async getOverviewInfo(_payload, _rootState, { $db }) {
        const [fileSetCount, sourceFileCount, ruleCount] = await Promise.all([
          $db.TableFileSet.count(),
          $db.TableSourceFile.count(),
          $db.TableRule.count(),
        ]);
        this.setState({
          countOverview: { fileSetCount, sourceFileCount, ruleCount },
        });
      },
      async addNewSet(_, _1, { $db }) {
        const id = await $db.addNewFileSet({
          name: 'Unset Name',
        });
        hashHistory.push(`/set-detail?id=${id}`);
      },
      async getFileSetDetail({ id }, _, { $db }) {
        const set = await $db.TableFileSet.get(id);
        if (!set) {
          return set;
        }
        const { sourceFileIds, ruleIds } = set;
        const [sourceFileList, ruleList] = await Promise.all([
          $db.TableSourceFile.where('id')
            .anyOf(sourceFileIds)
            .toArray(),
          $db.TableRule.where('id')
            .anyOf(ruleIds)
            .toArray(),
        ]);
        return {
          ...set,
          sourceFileList,
          ruleList,
        };
      },
      async addNewRuleOfSet({ id }, _, { $db }) {
        const ruleId = await $db.addNewRule({
          filesSetId: id,
        });
        return $db.TableRule.get(ruleId);
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

export const MATCH_TYPE_OPTIONS = () => [
  [MATCH_TYPE.ALL, 'Match all'],
  [MATCH_TYPE.DOMAIN, 'Match domain'],
];
