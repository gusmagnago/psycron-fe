import type { AvatarProps } from '@mui/material';

export interface IAvatarProps extends AvatarProps {
    firstName: string;
    large?: boolean;
    lastName: string;
}
