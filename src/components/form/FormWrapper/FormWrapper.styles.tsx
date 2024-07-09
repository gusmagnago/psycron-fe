import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ModalContentWrapper = styled(Box)`
    position: absolute;
    background-color: ${palette.background.paper};
    padding: ${spacing.medium} ${spacing.mediumLarge};
    border-radius: ${spacing.mediumLarge};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
