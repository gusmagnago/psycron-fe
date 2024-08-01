import { Box, css, keyframes, styled } from '@mui/material';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const blurIn = keyframes`
0% {
    filter:blur(12px);
    opacity:0
}
100% {
    filter:blur(0);
    opacity:1
}
`;

export const UserDetailsCardWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'isVisible',
})<{ isVisible?: boolean }>`
    height: auto;
    padding: ${spacing.medium} ${spacing.mediumLarge};
    border-radius: calc(2 * ${spacing.medium});
    box-shadow: ${shadowMain};
    backdrop-filter: blur(10px);
    position: absolute;
    z-index: 100;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border: 2px solid rgba(170, 170, 204, 0.1);

    ${({ isVisible }) =>
		isVisible &&
        css`
            animation: ${blurIn} 0.09s linear both;
        `}
`;
