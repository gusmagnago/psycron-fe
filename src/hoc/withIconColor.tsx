import type { FC } from 'react';

export interface WithIconColorProps {
  color?: string;
}
const withIconColor = <P extends object>(Component: FC<P>) => {
  const WrappedComponent: FC<P & WithIconColorProps> = ({
    color,
    ...props
  }) => <Component {...(props as P)} style={{ color }} />;

  return WrappedComponent;
};

export default withIconColor;
