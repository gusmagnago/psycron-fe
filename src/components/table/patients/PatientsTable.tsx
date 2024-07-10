import { useMemo } from 'react';

import type { ITableCellProps } from '../components/table-cell/TableCell.types';
import { Table } from '../Table';

import { patientsTablerowsData, transformPatientsData } from './row/rows';
import { useTranslation } from 'react-i18next';

export const PatientsTable = () => {
  const { t } = useTranslation();

  // all info should come from the row
  const headCells: ITableCellProps[] = [
    {
      id: 'fullName',
      numeric: false,
      icon: false,
      label: t('components.patients-table.name'),
    },
    {
      id: 'nextSession',
      numeric: false,
      icon: false,
      label: t('components.patients-table.next-session'),
    },
    {
      id: 'paymentStatus',
      numeric: false,
      icon: true,
      label: t('components.patients-table.payment-status'),
    },
    {
      id: 'sessionsPerMonth',
      numeric: true,
      icon: false,
      label: t('components.patients-table.sessions-month'),
    },
    {
      id: 'sessionVal',
      numeric: false,
      icon: false,
      label: t('components.patients-table.value'),
    },
    {
      id: 'hasDiscount',
      numeric: false,
      icon: true,
      label: t('components.patients-table.discount'),
    },
    {
      id: 'discountVal',
      numeric: true,
      icon: false,
      label: t('components.patients-table.discount-val'),
    },
    {
      id: 'fullAmount',
      numeric: true,
      icon: false,
      label: t('components.patients-table.amount'),
    },
    {
      id: 'currency',
      numeric: true,
      icon: false,
      label: t('components.patients-table.currency'),
    },
    {
      id: 'latestPayment',
      numeric: true,
      icon: false,
      label: t('components.patients-table.latest-payment'),
    },
    {
      id: 'action',
      numeric: false,
      icon: true,
      action: true,
      label: '',
    },
  ];

  const transformedRows = useMemo(
    () => transformPatientsData(patientsTablerowsData),
    []
  );

  const columnsToHideTablet = [
    'fullAmount',
    'hasDiscount',
    'discountVal',
    'latestPayment',
  ];
  const columnsToHideMobile = ['paymentStatus', 'currency', 'action'];

  return (
    <>
      <Table
        headItems={headCells}
        bodyItems={transformedRows}
        columnsToHideTablet={columnsToHideTablet}
        columnsToHideMobile={columnsToHideMobile}
      />
    </>
  );
};
