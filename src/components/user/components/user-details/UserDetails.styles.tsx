import { Box, styled, Typography } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const UserDetailsTop = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: ${spacing.mediumSmall} 0;
`;

export const NameEmailBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 ${spacing.mediumSmall};
`;

export const UserDetailsItems = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const UserDetailsItemWrapper = styled(Box)`
  display: flex;
  padding: ${spacing.mediumSmall} 0;
  justify-content: space-between;
`;

export const ItemIcon = styled(Box)`
  display: flex;
  align-items: center;
  svg {
    margin-right: ${spacing.small};
  }
`;

export const ItemLinkWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  a {
    margin: 0;
  }
`;

export const AddressItem = styled(Typography)`
  padding-bottom: ${spacing.xs};
`;
