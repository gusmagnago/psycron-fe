import { useState } from 'react';
import { Send } from '@psycron/components/icons';

import {
	ComposerAtom,
	ComposerInput,
	SendButtonAtom,
} from './AvailabilityComponentsPreview.styles';

interface ComposerDemoProps {
	idPrefix?: string;
	onSubmit?: (value: string) => void;
	placeholder?: string;
}

// Interactive composer atom: typing into the input marks the send button
// active, which straightens the plane icon to 0deg. onSubmit fires the typed
// value (Enter or send click) and clears the field.
export const ComposerDemo = ({
	idPrefix = 'jupiter-onboarding',
	onSubmit,
	placeholder = 'Type your own…',
}: ComposerDemoProps) => {
	const [value, setValue] = useState('');
	const isActive = value.trim().length > 0;

	const submit = () => {
		if (!isActive) return;
		onSubmit?.(value.trim());
		setValue('');
	};

	return (
		<ComposerAtom id={`${idPrefix}-composer`} data-testid={`${idPrefix}-composer`}>
			<ComposerInput
				id={`${idPrefix}-composer-input`}
				data-testid={`${idPrefix}-composer-input`}
				aria-label='Message Jupiter'
				placeholder={placeholder}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') submit();
				}}
			/>
			<SendButtonAtom
				id={`${idPrefix}-composer-send`}
				data-testid={`${idPrefix}-composer-send`}
				aria-label='Send'
				type='button'
				active={isActive}
				onClick={submit}
			>
				<Send />
			</SendButtonAtom>
		</ComposerAtom>
	);
};
