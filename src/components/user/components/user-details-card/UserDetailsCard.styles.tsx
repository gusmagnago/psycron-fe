import { Box, css, keyframes, styled } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
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
  backdrop-filter: blur(30px);
  position: absolute;
  z-index: 100;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ isVisible }) =>
		isVisible &&
    css`
      animation: ${blurIn} 0.09s linear both;
    `}

  ${isBiggerThanMediumMedia} {
    width: 50%;
  }
`;
