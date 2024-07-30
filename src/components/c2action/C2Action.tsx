import { TextField } from '@mui/material';
import type { FieldValues, Path } from 'react-hook-form';

import {
  C2ActionBox,
  C2ActionButton,
  C2ActionText,
  C2ActionWrapper,
  HighlightedText,
} from './C2Action.styles';
import { IC2ActionProps } from './C2Action.types';
import { Trans } from 'react-i18next';

export const C2Action = <T extends FieldValues>({
  i18nKey,
  handleSubmit,
  onSubmit,
  label,
  register,
  errors,
  bttnText,
}: IC2ActionProps<T>) => {
  return (
    <C2ActionWrapper>
      <C2ActionText variant='subtitle1'>
        <Trans i18nKey={i18nKey} components={{ strong: <HighlightedText /> }} />
      </C2ActionText>
      <C2ActionBox component='form' onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={label}
          fullWidth
          id='email'
          {...register('email' as Path<T>)}
          error={!!errors.email}
          helperText={errors.email?.message as string}
        />
        <C2ActionButton type='submit'>{bttnText}</C2ActionButton>
      </C2ActionBox>
    </C2ActionWrapper>
  );
};
