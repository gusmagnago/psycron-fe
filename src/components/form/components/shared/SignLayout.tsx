import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { LogoColor } from '@psycron/components/icons/brand/LogoColor';
import { Link } from '@psycron/components/link/Link';
import { NavigateLink } from '@psycron/components/link/navigate/NavigateLink';
import { Loader } from '@psycron/components/loader/Loader';
import { SIGNIN, SIGNUP } from '@psycron/pages/urls';

import {
	LogoWrapper,
	SignLayoutFooterLink,
	SignTitle,
	SignUpWrapper,
} from './SignLayout.styles';
import type { ISignLayout } from './SignLayout.types';

export const SignLayout: FC<ISignLayout> = ({
	children,
	isSignin,
	isReset,
	isLoading,
	title,
}: ISignLayout) => {
	const { t } = useTranslation();

	const isTestEnv = window.location.hostname.startsWith('dev.');

	const onClick = (): void => {
		capture(PostHogEvent.AuthSwitchFormClicked, {
			from: isSignin ? 'sign in' : 'sign up',
			to: isSignin ? 'sign up' : 'sign in',
		});
	};

	return (
		<SignUpWrapper>
			<LogoWrapper>
				<LogoColor />
				{String(title) ? <SignTitle>{title}</SignTitle> : null}
			</LogoWrapper>
			{!isLoading ? (
				<>
					{children}
					<SignLayoutFooterLink>
						{isReset ? (
							<NavigateLink isBack />
						) : !isTestEnv ? (
							<>
								<Typography variant='caption'>
									{isSignin
										? t('components.form.signin.dont-have-acc')
										: t('components.form.signup.already-have-acc')}
								</Typography>
								<Link
									to={`${isSignin ? SIGNUP : SIGNIN}`}
									firstLetterUpper
									onClick={onClick}
								>
									{isSignin
										? t('components.form.signin.signup-here-link')
										: t('components.form.signup.signin-here-link')}
								</Link>
							</>
						) : null}
					</SignLayoutFooterLink>
				</>
			) : (
				<Loader />
			)}
		</SignUpWrapper>
	);
};
