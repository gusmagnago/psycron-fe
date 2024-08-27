import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import type { CustomError } from '@psycron/api/error';
import type { IChangePass, IPasswordChange } from '@psycron/api/user';
import { changePassword } from '@psycron/api/user';
import { FormFooter } from '@psycron/components/form/components/footer/FormFooter';
import { PasswordInput } from '@psycron/components/form/components/password/PasswordInput';
import { StyledIconButton } from '@psycron/components/form/components/password/PasswordInput.styles';
import { NotVisible, Visible } from '@psycron/components/icons';
import { Asterix } from '@psycron/components/icons/Asterix';
import { Text } from '@psycron/components/text/Text';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation } from '@tanstack/react-query';

import {
	EditPasswordWrapper,
	StyledCurrentPassword,
	StyledExample,
	StyledInfoWrapper,
	StyledListIcon,
	StyledPasswordForm,
} from './EditPassword.styles';

export const EditPassword = () => {
	const { t } = useTranslation();

	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();

	const [isCurrPassVisible, setIsCurrPassVisible] = useState<boolean>(false);
	const [currPasswordValue, setCurrPasswordValue] = useState<string>('');

	const { showAlert } = useAlert();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const changePasswordMutation = useMutation({
		mutationFn: (changePassData: IChangePass) => changePassword(changePassData),
		onSuccess: (data) => {
			showAlert({
				message: data.message,
				severity: 'success',
			});
			navigate(-1);
		},
		onError: (data: CustomError) => {
			showAlert({
				message: data?.message,
				severity: 'error',
			});
		},
	});

	const handleChangePass = (data: IPasswordChange) => {
		const changePassData = {
			userId: userId,
			data: data,
		};

		changePasswordMutation.mutate(changePassData);
	};

	const handleInputChange = (value: string) => {
		setCurrPasswordValue(value);
	};

	const togglePassVisibility = () => {
		setIsCurrPassVisible((prev) => !prev);
	};

	const rulesItems = [
		t('page.reset-password.item-letter', { rule: '(A - Z or a - z)' }),
		t('page.reset-password.item-number', { rule: '(9 - 0)' }),
		t('page.reset-password.item-special', {
			rule: '(!@#$%^&*(),.?&quot;:{}|<></>)',
		}),
		t('page.reset-password.item-minimum'),
	];

	return (
		<Box display='flex' flexDirection='column' alignItems='center'>
			<Text variant='h6' pb={5}>
				{t('page.reset-password.change-password')}
			</Text>
			<EditPasswordWrapper>
				<StyledPasswordForm as='form' onSubmit={handleSubmit(handleChangePass)}>
					<StyledCurrentPassword
						label={t('page.reset-password.current-password')}
						type={!isCurrPassVisible ? 'password' : 'text'}
						{...register('currentPassword')}
						autoComplete='password'
						onChange={(e) => {
							handleInputChange(e.target.value);
						}}
						required
						InputProps={{
							endAdornment: currPasswordValue?.length ? (
								<InputAdornment position='end'>
									<StyledIconButton
										onMouseEnter={() => togglePassVisibility()}
										onMouseLeave={() => togglePassVisibility()}
										edge='end'
									>
										{isCurrPassVisible ? <NotVisible /> : <Visible />}
									</StyledIconButton>
								</InputAdornment>
							) : null,
						}}
					/>
					<Box>
						<PasswordInput
							errors={errors}
							register={register}
							hasToConfirm
							required
						/>
					</Box>
					<FormFooter />
				</StyledPasswordForm>
				<StyledInfoWrapper>
					<Text textAlign='left'>{t('page.reset-password.password-rule')}</Text>
					<List>
						{rulesItems.map((item, index) => (
							<ListItem key={index}>
								<StyledListIcon>
									<Asterix />
								</StyledListIcon>
								<ListItemText>{item}</ListItemText>
							</ListItem>
						))}
					</List>
					<StyledExample>
						<Text>{t('page.reset-password.password-example')} Password1!</Text>
					</StyledExample>
				</StyledInfoWrapper>
			</EditPasswordWrapper>
		</Box>
	);
};
