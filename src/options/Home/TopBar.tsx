import { AnyFunc } from '@/interfaces/utils';
import { Button, Card, Col, Input, Row, Statistic } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';

const { useEffect, useCallback } = React;

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

export const TopBar: React.SFC = () => {
  const { dispatch } = useStore();
  const { countOverview } = useMappedState(mapState());
  useEffect(() => {
    dispatch.options.getOverviewInfo();
  }, []);
  const handleClickAddNew = () => {
    dispatch.options.addNewSet();
  };
  return (
    <Card>
      <Row gutter={16} className="center">
        <Col span={4}>
          <Statistic title="File Set" value={countOverview.fileSetCount} />
        </Col>
        <Col span={4}>
          <Statistic title="Source" value={countOverview.sourceFileCount} />
        </Col>
        <Col span={4}>
          <Statistic title="Rule" value={countOverview.ruleCount} />
        </Col>
        <Col span={6}>
          <Button onClick={handleClickAddNew}>Add new set</Button>
        </Col>
      </Row>
    </Card>
  );
};
