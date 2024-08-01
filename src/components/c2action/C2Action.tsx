import type { FieldValues, Path } from 'react-hook-form';
import { Trans } from 'react-i18next';

import {
	C2ActionBox,
	C2ActionButton,
	C2ActionText,
	C2ActionWrapper,
	HighlightedText,
	StyledTextField,
} from './C2Action.styles';
import type { IC2ActionProps } from './C2Action.types';

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
			{i18nKey !== undefined ? (
				<C2ActionText variant='subtitle1'>
					<Trans
						i18nKey={i18nKey}
						components={{ strong: <HighlightedText /> }}
					/>
				</C2ActionText>
			) : null}
			<C2ActionBox component='form' onSubmit={handleSubmit(onSubmit)}>
				<StyledTextField
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
