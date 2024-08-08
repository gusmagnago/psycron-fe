import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Trans } from 'react-i18next';
import { useInView as RIUseInView } from 'react-intersection-observer';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	BGWrapper,
	Call2ActionFooterItem,
	Call2ActionFooterWrapper,
	Call2ActionInputWrapper,
	Heading,
	StyledDescriptionWrapper,
} from './Call2Action.styles';
import type { ICall2ActionSection } from './Call2Action.types';

export const Call2ActionSection = ({
	c2Action,
	headingText,
	i18nextTrans,
}: ICall2ActionSection) => {
	const { ref: call2ActionRef, inView: heroInView } = RIUseInView({
		threshold: 1,
	});

	useEffect(() => {
		if (heroInView) {
			ReactGA.event({
				category: 'Section',
				action: 'View Section',
				label: 'Call to Actio Section',
			});
		}
	}, [heroInView]);

	return (
		<BGWrapper id='join-now' as='section' ref={call2ActionRef}>
			<Call2ActionFooterWrapper>
				<Call2ActionFooterItem>
					<Heading variant='h2' isFirstUpper>
						{headingText}
					</Heading>
					<StyledDescriptionWrapper>
						<Text
							variant='body2'
							fontSize={'1rem'}
							color={palette.gray['08']}
							textAlign={'left'}
						>
							<Trans i18nKey={i18nextTrans} />
						</Text>
					</StyledDescriptionWrapper>
				</Call2ActionFooterItem>
			</Call2ActionFooterWrapper>
			<Call2ActionInputWrapper>{c2Action}</Call2ActionInputWrapper>
		</BGWrapper>
	);
};
