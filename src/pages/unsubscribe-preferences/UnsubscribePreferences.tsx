import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { unsubscribeByEmail } from '@psycron/api/subs';
import { Button } from '@psycron/components/button/Button';
import { InputFields } from '@psycron/components/form/components/shared/SignLayout.styles';
import { useMutation } from '@tanstack/react-query';

import {
	BackLink,
	Card,
	Description,
	Disclaimer,
	Heading,
	PageWrapper,
	SuccessWrapper,
} from './UnsubscribePreferences.styles';

type FormValues = { email: string };

export const UnsubscribePreferences = () => {
	const { t, i18n } = useTranslation();
	const [succeeded, setSucceeded] = useState(false);

	const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

	const mutation = useMutation({
		mutationFn: ({ email }: FormValues) => unsubscribeByEmail(email),
		onSuccess: () => setSucceeded(true),
	});

	const onSubmit = (data: FormValues) => mutation.mutate(data);

	const locale = i18n.language?.startsWith('pt') ? 'pt' : 'en';

	return (
		<PageWrapper>
			<Card>
				{succeeded ? (
					<SuccessWrapper>
						<Heading variant='h1'>
							{t('page.unsubscribe-preferences.success-title')}
						</Heading>
						<Description>
							{t('page.unsubscribe-preferences.success-description')}
						</Description>
						<BackLink href={`/${locale}`}>
							{t('page.unsubscribe-preferences.back-home')}
						</BackLink>
					</SuccessWrapper>
				) : (
					<>
						<Heading variant='h1'>
							{t('page.unsubscribe-preferences.title')}
						</Heading>
						<Description>
							{t('page.unsubscribe-preferences.description')}
						</Description>

						<form onSubmit={handleSubmit(onSubmit)} noValidate>
							<InputFields
								label={t('page.unsubscribe-preferences.email-label')}
								placeholder={t('page.unsubscribe-preferences.email-placeholder')}
								type='email'
								fullWidth
								{...register('email', { required: true })}
								error={!!errors.email || !!mutation.error}
								sx={{ mb: 2 }}
							/>
							<Button
								type='submit'
								fullWidth
								isLoading={mutation.isPending}
							>
								{t('page.unsubscribe-preferences.submit')}
							</Button>
						</form>

						<Disclaimer>
							{t('page.unsubscribe-preferences.disclaimer')}
						</Disclaimer>
					</>
				)}
			</Card>
		</PageWrapper>
	);
};
