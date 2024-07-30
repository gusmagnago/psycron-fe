import { Header } from '@psycron/components/header/Header';
import { Outlet } from 'react-router-dom';
import {
  PublicLayoutContent,
  PublicLayoutWrapper,
} from './PublicLayout.styles';

export const PublicLayout = () => {
  return (
    <PublicLayoutWrapper>
      <Header />
      <PublicLayoutContent>
        <Outlet />
      </PublicLayoutContent>
    </PublicLayoutWrapper>
  );
};
