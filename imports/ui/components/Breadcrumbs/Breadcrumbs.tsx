import { Breadcrumb, BreadcrumbProps, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { DashboardIcon } from '@ui/components/Icons/DashboardIcon';

type Props = BreadcrumbProps;

export const Breadcrumbs: React.FC<Props> = ({ items, ...rest }) => (
  <Breadcrumb
    className="mb-4"
    items={[
      {
        title: (
          <Space>
            <DashboardIcon />
            <Link to={AppUrl.HOME}>Inicio</Link>
          </Space>
        ),
      },
      ...(items ?? []),
    ]}
    {...rest}
  />
);
