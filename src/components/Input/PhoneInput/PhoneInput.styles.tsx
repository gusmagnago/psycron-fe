import styled from '@emotion/styled';
import { palette } from '@psycron/theme/palette/palette.theme';

export const CountryFlag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;

  span {
    font-size: 20px;
  }
  svg {
    color: ${palette.primary.main}
  }
`;
