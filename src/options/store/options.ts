import { Log } from '@/common/log';
import { NEW_THING_ID_PREFIX_MARK_REGEX } from '@/common/utils';
import { hashHistory } from '@/components/hashHistory';
import {
  FileSetDetail,
  MATCH_TYPE,
  Rule,
  RUN_AT,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
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
      async saveFileSet(payload: FileSetDetail, _, { $db }) {
        const { id, name, ruleList, sourceFileList, status } = payload;

        // insert & update rule list
        const updatePartial: Rule[] = [];
        const insertPartial: Array<PartialId<Rule>> = [];
        ruleList.forEach(r => {
          const { id: rid, ...rest } = r;
          if (NEW_THING_ID_PREFIX_MARK_REGEX.test(rid + '')) {
            insertPartial.push(rest);
          } else {
            updatePartial.push(r);
          }
        });
        const [, newRuleIds] = await Promise.all([
          Promise.all(
            updatePartial.map(async r => {
              return $db.TableRule.update(+r.id, { ...r });
            }),
          ),
          Promise.all(
            insertPartial.map(async r => {
              return $db.addNewRule(r);
            }),
          ),
        ]);

        // insert & update source file list
        const updatePartialFileList: SourceFile[] = [];
        const insertPartialFileList: Array<PartialId<SourceFile>> = [];
        sourceFileList.forEach(f => {
          const { id: rid, ...rest } = f;
          if (NEW_THING_ID_PREFIX_MARK_REGEX.test(rid + '')) {
            insertPartialFileList.push(rest);
          } else {
            updatePartialFileList.push(f);
          }
        });
        const [, newFileIds] = await Promise.all([
          Promise.all(
            updatePartialFileList.map(async f => {
              return $db.TableSourceFile.update(+f.id, { ...f });
            }),
          ),
          Promise.all(
            insertPartialFileList.map(async f => {
              return $db.addNewSourceFile(f);
            }),
          ),
        ]);

        payload.ruleList = [
          ...updatePartial,
          ...insertPartial.map((r, i) => ({ ...r, id: newRuleIds[i] })),
        ];
        payload.ruleIds = payload.ruleList.map(r => r.id);
        payload.sourceFileList = [
          ...updatePartialFileList,
          ...insertPartialFileList.map((f, i) => ({ ...f, id: newFileIds[i] })),
        ];
        payload.sourceFileIds = payload.sourceFileList.map(f => f.id);

        await $db.updateFileSet({
          id,
          name,
          status,
          sourceFileIds: payload.sourceFileIds,
          ruleIds: payload.ruleIds,
        });
        return payload;
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

export const SOURCE_TYPE_OPTIONS = () => [
  [SOURCE_TYPE.CSS, 'CSS'],
  [SOURCE_TYPE.JS, 'JS'],
];

export const RUN_AT_OPTIONS = () => [
  [RUN_AT.DOCUMENT_IDLE, 'idle'],
  [RUN_AT.DOCUMENT_START, 'document start'],
  [RUN_AT.DOCUMENT_END, 'document end'],
];
