import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider } from '@psycron/components/divider/Divider';
import { LogoColor } from '@psycron/components/icons/brand/LogoColor';
import { Localization } from '@psycron/components/localization/Localization';
import { Text } from '@psycron/components/text/Text';

import {
	Content,
	FooterBar,
	LogoMark,
	ShellWrapper,
	TopBar,
} from './PublicBookingShell.styles';

interface IPublicBookingShellProps {
	children: ReactNode;
}

export const PublicBookingShell = ({ children }: IPublicBookingShellProps) => {
	const { t } = useTranslation();

	return (
		<ShellWrapper>
			<TopBar>
				<LogoMark>
					<LogoColor />
					<Text
						color='text.primary'
						fontWeight={700}
						variant='body1'
						fontSize={'1.4rem'}
					>
						Psycron
					</Text>
				</LogoMark>
				<Localization />
			</TopBar>

			<Content>{children}</Content>

			<Divider />
			<FooterBar>
				<LogoColor />
				<Text color='text.disabled' variant='caption'>
					{t('public.powered-by')}
				</Text>
			</FooterBar>
		</ShellWrapper>
	);
};
