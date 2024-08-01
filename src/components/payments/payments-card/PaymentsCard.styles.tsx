import { palette } from '@psycron/theme/palette/palette.theme';

import styled from '@emotion/styled';
import {
  shadowInnerPress,
  shadowMain,
  shadowPress,
} from '@psycron/theme/shadow/shadow.theme';

export const StyledBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 320px;
  height: 320px;
  background-color: ${palette.background.default};
  border-radius: 40px;
  box-shadow: ${shadowMain};
  z-index: 0;
`;

export const StyledInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  background-color: ${palette.background.default};
  border-radius: 50%;
  box-shadow: ${shadowInnerPress};
`;

export const StyledInnerRound = styled.div`
  width: 250px;
  height: 250px;
  background-color: ${palette.background.default};
  border-radius: 50%;
  box-shadow: ${shadowPress};
`;
