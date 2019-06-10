import { getHashQuery, updateHashQuery } from '@/common/utils';
import { STATUS } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Statistic } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';

const { useEffect, useCallback, useState } = React;
const { Button: RadioBtn, Group: RadioGroup } = Radio;

const mapState = () =>
  useCallback<
    AnyFunc<{
      countOverview: any;
      loading: boolean;
    }>
  >(
    _ => ({
      countOverview: _.options.countOverview,
      loading: _.loading.effects.options.getOverviewInfo,
    }),
    [],
  );

const FILTER_STATUS_KEY = 'filterStatus';
const FILTER_NAME_KEY = 'filterName';

export const TopBar: React.SFC = () => {
  const { dispatch } = useStore();
  const { countOverview } = useMappedState(mapState());
  const [filter, _] = useState({
    [FILTER_STATUS_KEY]: getHashQuery(FILTER_STATUS_KEY) || '',
    [FILTER_NAME_KEY]: getHashQuery(FILTER_NAME_KEY) || '',
  });
  const setFilter = (p: Record<string, string>) => _(pre => ({ ...pre, ...p }));

  useEffect(() => {
    dispatch.all.getFileSetList({
      status: filter[FILTER_STATUS_KEY],
      name: filter[FILTER_NAME_KEY],
    });
    dispatch.options.getOverviewInfo();
  }, []);

  const handleClickAddNew = () => {
    dispatch.options.addNewSet();
  };

  const handleFilterStatusChnage = (e: RadioChangeEvent) => {
    const v = e.target.value;
    dispatch.all.getFileSetList({ status: v, name: filter[FILTER_NAME_KEY] });
    updateHashQuery({ [FILTER_STATUS_KEY]: v });
    setFilter({
      [FILTER_STATUS_KEY]: v,
    });
  };

  const handleFilterNameChnage = e => {
    clearTimeout(e.target.timer);
    const v = e.target.value;
    setFilter({ [FILTER_NAME_KEY]: v });

    e.target.timer = setTimeout(() => {
      dispatch.all.getFileSetList({
        status: filter[FILTER_STATUS_KEY],
        name: v,
      });
      updateHashQuery({ [FILTER_NAME_KEY]: v });
    }, 500);
  };

  return (
    <Card>
      <Row gutter={16} className="center">
        <Col span={8}>
          <Statistic title="File Set" value={countOverview.fileSetCount} />
        </Col>
        <Col span={8}>
          <Statistic title="Source" value={countOverview.sourceFileCount} />
        </Col>
        <Col span={8}>
          <Statistic title="Rule" value={countOverview.ruleCount} />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'left' }}>
          <Form.Item label="Actions" style={{ marginBottom: 0 }}>
            <Button onClick={handleClickAddNew} style={{ marginRight: 16 }}>
              Add new set
            </Button>
            <RadioGroup
              style={{ marginRight: 16 }}
              value={filter[FILTER_STATUS_KEY]}
              onChange={handleFilterStatusChnage}
            >
              <RadioBtn value="">All</RadioBtn>
              <RadioBtn value={STATUS.ENABLE}>Enable</RadioBtn>
              <RadioBtn value={STATUS.DISABLE}>Disable</RadioBtn>
            </RadioGroup>
            <Input
              placeholder="Input to filter"
              value={filter[FILTER_NAME_KEY]}
              onChange={handleFilterNameChnage}
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
