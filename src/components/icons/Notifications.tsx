export const Notifications: React.FC = (props) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}
		>
			<path d='m2 8 2 2-2 2 2 2-2 2' />
			<path d='m22 8-2 2 2 2-2 2 2 2' />
			<rect width='8' height='14' x='8' y='5' rx='1' />
		</svg>
	);
};
