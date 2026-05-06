export const Archive: React.FC = (props) => (
	<svg
		fill='none'
		height='24'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'
		width='24'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<rect height='5' rx='1' width='20' x='2' y='3' />
		<path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' />
		<path d='M10 12h4' />
	</svg>
);
