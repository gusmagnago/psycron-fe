import { ParallaxBenefitItem } from './benefits-item/BenefitsItem';
import { BenefitsBox, BenefitsSectionWrapper } from './Benefits.styles';

export const Benefits = () => {
	const benefits = [
		{
			key: 'increased-efficiency',
			img: '/images/img-clock.png',
			imgAlt: '3D illustration of a pink alarm clock ',
			justify: 'end',
		},
		{
			key: 'better-patient-management',
			img: '/images/img-sort.png',
			imgAlt: '3D illustration of a file organizer box with several folders.',
			justify: 'start',
		},
		{
			key: 'reduced-administrative-burden',
			img: '/images/img-hero4.png',
			imgAlt:
				'3D illustration of hands forming a heart shape with a speech bubble.',
			justify: 'end',
		},
		{
			key: 'enhanced-financial-control',
			img: '/images/img-locker.png',
			imgAlt:
				'3D illustration of a pink piggy bank with gold coins stacked beside it.',
			justify: 'start',
		},
	];

	return (
		<BenefitsSectionWrapper as='section'>
			<BenefitsBox>
				{benefits.map(({ key, img, imgAlt, justify }, index) => (
					<ParallaxBenefitItem
						key={`benefit-item-${index}`}
						img={img}
						imgAlt={imgAlt}
						justify={justify}
						i18Nkey={key}
					/>
				))}
			</BenefitsBox>
		</BenefitsSectionWrapper>
	);
};
