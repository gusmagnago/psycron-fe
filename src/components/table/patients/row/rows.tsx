import type { ITableCellProps } from '@psycron/components/table/components/table-cell/TableCell.types';

import type { IPatientsTableData } from '../PatientsTable.types';

// all info should com from a context provider

export const transformPatientsData = (
  data: IPatientsTableData[]
): ITableCellProps[][] => {
  return data.map((row) => [
    {
      id: 'fullName',
      label: row.fullName,
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'nextSession',
      label: row.nextSession,
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'paymentStatus',
      label: row.paymentStatus,
      numeric: false,
      icon: true,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'sessionsPerMonth',
      label: String(row.sessionsPerMonth),
      numeric: true,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'sessionVal',
      label: String(row.sessionVal),
      numeric: true,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'hasDiscount',
      label: row.hasDiscount ? 'Yes' : 'No',
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'discountVal',
      label: String(row.discountVal),
      numeric: true,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'fullAmount',
      label: String(row.fullAmount),
      numeric: true,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'currency',
      label: row.currency,
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'latestPayment',
      label: row.latestPayment,
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
    },
    {
      id: 'action',
      label: '',
      numeric: false,
      isPatients: true,
      itemId: row.itemId,
      action: true,
    },
  ]);
};

export const createDataRows = (
  fullName: string,
  nextSession: string,
  paymentStatus: string,
  sessionsPerMonth: number,
  sessionVal: number,
  hasDiscount: boolean,
  discountVal: number,
  fullAmount: number,
  currency: string,
  latestPayment: string,
  itemId: string,
  actions: string
): IPatientsTableData => {
  return {
    fullName,
    nextSession,
    paymentStatus,
    sessionsPerMonth,
    sessionVal,
    hasDiscount,
    discountVal,
    fullAmount,
    currency,
    latestPayment,
    itemId,
    actions,
  };
};

export const patientsTablerowsData = [
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T15:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T15:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T16:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T17:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T18:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T19:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T15:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T15:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T16:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T17:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
  createDataRows(
    'Jupiter Magnago Ferraz',
    '2024-07-04T18:00:00',
    'paid',
    5,
    100,
    false,
    0,
    500,
    'EUR',
    '2024-06-04T19:00:00',
    'gxchjkhljkçjhgchvhbnm,~',
    '  '
  ),
];
