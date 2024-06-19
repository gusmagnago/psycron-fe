import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';

export const CountryFlag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    font-size: 20px;
  }
  svg {
    color: ${palette.primary.main};
  }
`;

export const PhoneNumberField = styled(TextField)`
  & input[type='number'] {
    appearance: textfield; /* Firefox */
  }

  & input[type='number']::-webkit-outer-spin-button,
  & input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none; /* Chrome, Safari, Edge */
    margin: 0;
  }
`;
