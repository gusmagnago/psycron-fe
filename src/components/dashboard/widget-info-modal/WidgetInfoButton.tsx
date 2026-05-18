import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Info } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

const InfoButtonIcon = styled.span`
	align-items: center;
	display: flex;
	justify-content: center;
`;

interface WidgetInfoButtonProps {
	onClick?: () => void;
}

export const WidgetInfoButton = ({ onClick }: WidgetInfoButtonProps) => {
	const { t } = useTranslation();
	const label = t('page.dashboard.widgets.info-modal.tooltip');

	return (
		<Tooltip
			aria-label={label}
			onClick={onClick}
			placement='bottom'
			title={label}
		>
			<InfoButtonIcon>
				<Info />
			</InfoButtonIcon>
		</Tooltip>
	);
};
