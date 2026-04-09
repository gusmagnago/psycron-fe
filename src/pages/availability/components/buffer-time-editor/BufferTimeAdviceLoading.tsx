import { useTranslation } from 'react-i18next';

import {
	BufferThinkingDots,
	BufferThinkingRow,
} from './BufferTimeEditor.styles';

export const BufferTimeAdviceLoading = () => {
	const { t } = useTranslation();

	return (
		<BufferThinkingRow>
			<span>{t('jupiter.post-publish.buffer-jupiter-thinking')}</span>
			<BufferThinkingDots aria-hidden='true'>
				<span />
				<span />
				<span />
			</BufferThinkingDots>
		</BufferThinkingRow>
	);
};
