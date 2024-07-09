export const tableBones = (action?: boolean, index?: number) => {
	if (action) return 0.5;
	if (index === 0) return 1.5;
	return 1;
};
