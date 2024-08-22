import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Brand } from '@psycron/components/icons';
import { Link } from '@psycron/components/link/Link';
import { NavigateLink } from '@psycron/components/link/navigate/NavigateLink';
import { SIGNIN, SIGNUP } from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';

import type { ISignLayout } from './SignLayout.types';
import { LogoWrapper, SignUpWrapper } from './styles';

export const SignLayout: FC<ISignLayout> = ({
	children,
	isSignin,
	isReset,
}: ISignLayout) => {
	const { t } = useTranslation();

	return (
		<SignUpWrapper>
			<LogoWrapper display='flex' justifyContent='center'>
				<Brand color={palette.primary.main} />
			</LogoWrapper>
			{children}
			<Box mt={5} display='flex' justifyContent='center' alignItems='center'>
				{isReset ? (
					<NavigateLink isBack />
				) : (
					<>
						<Typography variant='caption'>
							{isSignin
								? t('components.form.signin.dont-have-acc')
								: t('components.form.signup.already-have-acc')}
						</Typography>
						<Link to={`/${isSignin ? SIGNUP : SIGNIN}`} firstLetterUpper>
							{isSignin
								? t('components.form.signin.signup-here-link')
								: t('components.form.signup.signin-here-link')}
						</Link>
					</>
				)}
			</Box>
		</SignUpWrapper>
	);
};
