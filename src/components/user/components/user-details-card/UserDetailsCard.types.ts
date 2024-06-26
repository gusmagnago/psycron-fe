import type { ReactNode } from 'react';
import type { AddressComponent } from '@psycron/components/form/components/address/AddressForm.types';

export interface IUserDetailsCardProps {
  plan: {
    name: string;
    status: string;
  };
  user: {
      contacts: {
        address: AddressComponent;
        phone: string;
        whatsapp?: string;
    },
    email: string;
    firstName: string;
    image?: string;
    lastName: string;
    pass: string;
    patients: number[];
  };
}

export interface IUserItem {
  icon: ReactNode;
  name: string;
  value: ReactNode;
}