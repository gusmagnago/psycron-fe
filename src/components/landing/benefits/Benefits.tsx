import { ParallaxBenefitItem } from './benefits-item/BenefitsItem';
import { BenefitsBox, BenefitsSectionWrapper } from './Benefits.styles';

export const Benefits = () => {
	const benefits = [
		{
			key: 'increased-efficiency',
			img: '/images/img-clock.png',
			imgAlt: 'clock-icon',
			justify: 'end',
		},
		{
			key: 'better-patient-management',
			img: '/images/img-sort.png',
			imgAlt: 'sorting-box',
			justify: 'start',
		},
		{
			key: 'reduced-administrative-burden',
			img: '/images/img-hero4.png',
			imgAlt: 'img-heart-hands',
			justify: 'end',
		},
		{
			key: 'enhanced-financial-control',
			img: '/images/img-locker.png',
			imgAlt: 'locker-pig',
			justify: 'start',
		},
	];

	return (
		<BenefitsSectionWrapper>
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
