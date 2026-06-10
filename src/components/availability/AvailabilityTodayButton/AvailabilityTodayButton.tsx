import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Today } from '@psycron/components/icons';
import i18n from '@psycron/i18n';
import { AVAILABILITYWEEK_BASE } from '@psycron/pages/urls';
import { format } from 'date-fns';

interface AvailabilityTodayButtonProps {
	iconOnly?: boolean;
	id?: string;
	onClick?: () => void;
	testId?: string;
}

export const AvailabilityTodayButton = ({
	iconOnly = false,
	id = 'availability-today-button',
	onClick,
	testId = 'availability-today-button',
}: AvailabilityTodayButtonProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleClick = () => {
		if (onClick) {
			onClick();
			return;
		}
		navigate(
			`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(new Date(), 'yyyy-MM-dd')}`
		);
	};

	if (iconOnly) {
		return (
			<Tooltip title={t('common.today')} arrow placement='top'>
				<span>
					<Button
						secondary
						small
						data-testid={testId}
						id={id}
						onClick={handleClick}
					>
						<Today />
					</Button>
				</span>
			</Tooltip>
		);
	}

	return (
		<Button secondary small data-testid={testId} id={id} onClick={handleClick}>
			<Today />
			{t('common.today')}
		</Button>
	);
};
