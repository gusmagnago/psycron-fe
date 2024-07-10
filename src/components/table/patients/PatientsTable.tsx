import { useMemo } from 'react';

import type { ITableCellProps } from '../components/table-cell/TableCell.types';
import { Table } from '../Table';

import { patientsTablerowsData, transformPatientsData } from './row/rows';

export const PatientsTable = () => {
  // all info should come from the row
  const headCells: ITableCellProps[] = [
    {
      id: 'fullName',
      numeric: false,
      icon: false,
      label: 'Patient Name',
    },
    {
      id: 'nextSession',
      numeric: false,
      icon: false,
      label: 'Next Session',
    },
    {
      id: 'paymentStatus',
      numeric: false,
      icon: true,
      label: 'Payment Status',
    },
    {
      id: 'sessionsPerMonth',
      numeric: true,
      icon: false,
      label: 'Sessions Per Month',
    },
    {
      id: 'sessionVal',
      numeric: false,
      icon: false,
      label: 'Value Per Session',
    },
    {
      id: 'hasDiscount',
      numeric: false,
      icon: true,
      label: 'Discount?',
    },
    {
      id: 'discountVal',
      numeric: true,
      icon: false,
      label: 'Discount value',
    },
    {
      id: 'fullAmount',
      numeric: true,
      icon: false,
      label: 'Full amount',
    },
    {
      id: 'currency',
      numeric: true,
      icon: false,
      label: 'Currency',
    },
    {
      id: 'latestPayment',
      numeric: true,
      icon: false,
      label: 'Latest Payment',
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
