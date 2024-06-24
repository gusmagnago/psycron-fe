import { spacing } from '../spacing/spacing.theme';

export const generateBorder = (color?: string) => {
	return `2px solid ${color}`
}

export const borderRadiusMixin = `
 calc(2 * ${spacing.mediumSmall})
`;