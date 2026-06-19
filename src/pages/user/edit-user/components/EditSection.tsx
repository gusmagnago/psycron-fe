import { Box } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import { Text } from '@psycron/components/text/Text';

import type { EditSectionProps } from './EditSection.types';

export const EditSection = ({
	title,
	isEnabled,
	onToggle,
	children,
	disabled = false,
	testId,
}: EditSectionProps) => {
	return (
		<Box display='flex' flexDirection='column' gap={2} data-testid={testId}>
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<Text variant='subtitle1' fontWeight={700}>
					{title}
				</Text>

				<Switch
					label='Edit'
					checked={isEnabled}
					disabled={disabled}
					onChange={(_, next) => onToggle(next)}
				/>
			</Box>

			<Box
				aria-disabled={!isEnabled}
				sx={(theme) => ({
					opacity: isEnabled ? 1 : 0.6,
					pointerEvents: isEnabled ? 'auto' : 'none',
					transition: theme.transitions.create('opacity', {
						duration: theme.transitions.duration.shortest,
					}),
				})}
			>
				{children}
			</Box>
		</Box>
	);
};
