import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { getSubscriber, unSubscribe } from '@psycron/api/subs';
import { Loader } from '@psycron/components/loader/Loader';
import { Text } from '@psycron/components/text/Text';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQuery } from '@tanstack/react-query';

import { HOMEPAGE } from '../urls';

import {
	ImgWrapper,
	StyldBodyText,
	StyledLink,
	TextWrapper,
	UnsubsHeading,
	UnsubsPageWrapper,
} from './Unsubscribe.styles';

export const Unsubscribe = () => {
	const { token } = useParams<{ token: string }>();

	const { t } = useTranslation();

	const { showAlert } = useAlert();
	const navigate = useNavigate();

	const { data, error, isLoading } = useQuery({
		queryKey: ['subscriber', token],
		queryFn: () => getSubscriber(token),
	});

	const handleNavigationAfterSuccess = () => {
		setTimeout(() => {
			navigate(HOMEPAGE);
		}, 5000);
	};

	const mutation = useMutation({
		mutationFn: () => unSubscribe(token),
		onSuccess: () => {
			showAlert({
				message: t('globals.success.subscribed'),
				severity: 'success',
			});
			handleNavigationAfterSuccess();
		},
		onError: () => {
			showAlert({
				message: t('globals.error.internal-server-error'),
				severity: 'warning',
				resetCallback: () => mutation.reset(),
			});
		},
	});

	return (
		<UnsubsPageWrapper>
			{isLoading ? (
				<Loader />
			) : (
				<>
					{error || !data ? (
						<Text>{t('globals.error.internal-server-error')}</Text>
					) : (
						<>
							<TextWrapper>
								<UnsubsHeading variant='h1'>
									{t('page.unsubscribe.title', { email: data.data?.email })}
								</UnsubsHeading>
								<Box>
									<StyldBodyText variant='h2'>
										{t('page.unsubscribe.body-text')}
									</StyldBodyText>
								</Box>
								<Text>{t('page.unsubscribe.see-you')}</Text>
								<StyledLink
									onClick={() => mutation.mutate()}
									isLoading={mutation.isPending}
								>
									{t('page.unsubscribe.confirm')}
								</StyledLink>
							</TextWrapper>
							<ImgWrapper>
								<img
									src='/images/error/img-unsubs.png'
									height={'100%'}
									width={'auto'}
								/>
							</ImgWrapper>
						</>
					)}
				</>
			)}
		</UnsubsPageWrapper>
	);
};
