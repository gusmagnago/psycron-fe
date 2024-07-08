import { Box, Link, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NoteCard = styled(Box)`
    box-shadow: ${shadowMain};
    padding: ${spacing.medium} ${spacing.mediumLarge};
    margin: ${spacing.small} 0;
    border-radius: ${spacing.medium};
    background-color: ${palette.primary.main};
`;

export const StoryLink = styled(Link)`
    text-decoration: none;
    margin-left: ${spacing.small};
    color: ${palette.secondary.main};
`;

export const ImgCredits = styled(Box)`
    padding: ${spacing.small};
    border-radius: ${spacing.mediumLarge};
    margin: ${spacing.small} 0;
    background-color: ${palette.gray['02']};

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    a {
        text-decoration: none;
        color: ${palette.secondary.main};
        margin: 0 ${spacing.space};
    }
`;
