import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Link, Typography } from '@mui/material';
import { Brand } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';

import { LogoWrapper, SignUpWrapper } from './styles';

export const SignLayout: FC<{ children: ReactNode; isSignin?: boolean }> = ({
	children,
	isSignin,
}) => {
	const { t } = useTranslation();

	return (
		<SignUpWrapper
			height={'100%'}
			borderRadius={10}
			boxShadow={shadowPress}
			m={6}
		>
			<LogoWrapper display='flex' justifyContent='center'>
				<Brand color={palette.primary.main} />
			</LogoWrapper>
			{children}
			<Box my={3} display='flex' justifyContent='center'>
				<Typography variant='caption'>
					{isSignin
						? t('components.form.signin.dont-have-acc')
						: t('components.form.signup.already-have-acc')}
					<Link>
						{' '}
						{isSignin
							? t('components.form.signin.signup-here-link')
							: t('components.form.signup.signin-here-link')}
					</Link>
				</Typography>
			</Box>
		</SignUpWrapper>
	);
};
