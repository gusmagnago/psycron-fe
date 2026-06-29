import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useCallback, useState } from 'react';
import { ChevronLeft, Send } from '@psycron/components/icons';

import {
	ChipButton,
	ChipsContainer,
	ChipsFadeOut,
	ContinueButton,
	OtherBackButton,
	OtherInput,
	OtherInputRow,
	OtherSendButton,
} from './ChatChips.styles';
import type { IMultiSelectChipsProps } from './ChatChips.types';
import { chipTestId } from './chatChips.utils';

export const MultiSelectChips = ({
	options,
	onConfirm,
	confirmLabel,
	disabled = false,
	otherChipKey,
	otherPlaceholder,
	onOtherSubmit,
	testIdPrefix,
}: IMultiSelectChipsProps) => {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [submitted, setSubmitted] = useState(false);
	const [showOther, setShowOther] = useState(false);
	const [otherValue, setOtherValue] = useState('');

	const toggleKey = useCallback(
		(key: string) => {
			if (disabled || submitted) return;
			if (key === otherChipKey) {
				setShowOther(true);
				return;
			}
			setSelectedKeys((prev) => {
				const next = new Set(prev);
				if (next.has(key)) {
					next.delete(key);
				} else {
					next.add(key);
				}
				return next;
			});
		},
		[disabled, otherChipKey, submitted]
	);

	const handleConfirm = () => {
		if (selectedKeys.size === 0 || submitted) return;
		setSubmitted(true);

		setTimeout(() => {
			onConfirm(Array.from(selectedKeys));
		}, 200);
	};

	const handleOtherKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && otherValue.trim()) {
			e.preventDefault();
			submitOther();
		}
	};

	const submitOther = () => {
		if (!otherValue.trim()) return;
		setSubmitted(true);
		setTimeout(() => {
			onOtherSubmit?.(otherValue.trim());
		}, 200);
	};

	if (submitted) {
		return <ChipsFadeOut />;
	}

	if (showOther) {
		return (
			<OtherInputRow data-testid={chipTestId(testIdPrefix, 'other-row')}>
				<OtherBackButton
					onClick={() => {
						setShowOther(false);
						setOtherValue('');
					}}
					data-testid={chipTestId(testIdPrefix, 'other-back')}
				>
					<ChevronLeft />
				</OtherBackButton>
				<OtherInput
					autoFocus
					size='small'
					placeholder={otherPlaceholder}
					value={otherValue}
					onChange={(e) => setOtherValue(e.target.value)}
					onKeyDown={handleOtherKeyDown}
					data-testid={chipTestId(testIdPrefix, 'other-input')}
				/>
				<OtherSendButton
					hasValue={!!otherValue.trim()}
					disabled={!otherValue.trim()}
					onClick={submitOther}
					data-testid={chipTestId(testIdPrefix, 'other-send')}
				>
					<Send />
				</OtherSendButton>
			</OtherInputRow>
		);
	}

	return (
		<ChipsContainer
			data-testid={chipTestId(testIdPrefix, 'chips')}
			id={chipTestId(testIdPrefix, 'chips')}
		>
			{options.map((option) => (
				<ChipButton
					key={option.key}
					chipVariant={option.variant}
					isSelected={selectedKeys.has(option.key)}
					onClick={() => toggleKey(option.key)}
					disabled={disabled}
					data-testid={chipTestId(testIdPrefix, `chip-${option.key}`)}
					id={chipTestId(testIdPrefix, `chip-${option.key}`)}
				>
					{option.icon}
					{option.label}
				</ChipButton>
			))}

			{selectedKeys.size > 0 && (
				<ContinueButton
					onClick={handleConfirm}
					data-testid={chipTestId(testIdPrefix, 'continue')}
				>
					{confirmLabel}
				</ContinueButton>
			)}
		</ChipsContainer>
	);
};
