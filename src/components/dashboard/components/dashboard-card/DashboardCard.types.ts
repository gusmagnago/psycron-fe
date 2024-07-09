/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement } from 'react';

import type { IDashboarcCardItemProps } from '../dashboard-card-item/DashboardCardItem.types';

export interface IDashboardCardProps {
    icon: ReactElement<any, any>;
    iconTitleKey: string;
    isPatientCard?: boolean;
    items: IDashboarcCardItemProps[];
    navigateToURL: string;
    titleKey: string;
}
