import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ModalProps } from '@mui/material';
import { Box, Button, Modal } from '@mui/material';

import { ModalContentWrapper } from './Form.styles';
import type { FormProps } from './Form.types';

export const Form = <T extends FieldValues>({
	handleSubmit,
	onSubmit,
	submitButtonLabel,
	children,
	formTitle,
	formDescription,
	open,
	onClose,
}: FormProps<T> & ModalProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby={`modal-form-${formTitle}`}
			aria-describedby={`modal-form-${formDescription}`}
		>
			<ModalContentWrapper component='form' onSubmit={handleSubmit(onSubmit)}>
				{children}
				<Box>
					<Button type='submit' fullWidth color='primary' variant='contained'>
						{t(submitButtonLabel)}
					</Button>
				</Box>
			</ModalContentWrapper>
		</Modal>
	);
};
