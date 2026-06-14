import { useTranslation } from 'react-i18next';

import { ComingSoonBadgeRoot } from './ComingSoonBadge.styles';
import type { ComingSoonBadgeProps } from './ComingSoonBadge.types';

export const ComingSoonBadge = ({ label, ...rest }: ComingSoonBadgeProps) => {
	const { t } = useTranslation();

	return (
		<ComingSoonBadgeRoot {...rest}>
			{label ?? t('globals.coming-soon-label')}
		</ComingSoonBadgeRoot>
	);
};
