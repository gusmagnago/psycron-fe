import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Loader } from '@psycron/components/loader/Loader';
import { shakeAnimation } from '@psycron/theme/animation';
import { useAnimation } from 'framer-motion';

import {
	C2ActionBox,
	C2ActionButton,
	C2ActionText,
	C2ActionWrapper,
	HighlightedText,
	StyledTextField,
} from './C2Action.styles';
import type { IC2ActionProps, IWaitlistSubs } from './C2Action.types';

export const C2Action = ({
	i18nKey,
	onSubmit,
	label,
	bttnText,
	error,
	isLoading,
}: IC2ActionProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IWaitlistSubs>();

	const controls = useAnimation();

	useEffect(() => {
		if (error && !isLoading) {
			controls.start(shakeAnimation);
		}
	}, [error, controls, isLoading]);

	return (
		<C2ActionWrapper component='form' onSubmit={handleSubmit(onSubmit)}>
			{i18nKey !== undefined ? (
				<C2ActionText variant='subtitle1'>
					<Trans
						i18nKey={i18nKey}
						components={{ strong: <HighlightedText /> }}
					/>
				</C2ActionText>
			) : null}
			<C2ActionBox animate={controls}>
				{isLoading ? (
					<Loader />
				) : (
					<>
						<StyledTextField
							label={label}
							fullWidth
							name='email'
							{...register('email')}
							error={!!errors.email || !!error}
							helperText={errors.email?.message || error}
						/>
						<C2ActionButton type='submit'>{bttnText}</C2ActionButton>
					</>
				)}
			</C2ActionBox>
		</C2ActionWrapper>
	);
};
