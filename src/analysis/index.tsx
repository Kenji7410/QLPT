import { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import RoomStatus from './RoomStatus';
import Revenue from './Revenue';
import { AnalysisPageProps } from './interface';

const AnalysisPage: FC<AnalysisPageProps> = () => (
  <PageContainer header={{ title: 'Thống kê' }}>
    <ProCard ghost gutter={[24, 0]}>
      <ProCard colSpan={8}>
        <RoomStatus />
      </ProCard>

      <ProCard colSpan={16}>
        <Revenue />
      </ProCard>
    </ProCard>
  </PageContainer>
);

export default AnalysisPage;
