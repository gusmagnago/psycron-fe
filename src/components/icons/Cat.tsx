export const Cat: React.FC = (props) => (
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
		<path d='M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.2.43-2.37 1-3.44 0 0-1.82-6.42-.42-7 1.39-.58 4.64.26 6.42 2.26C10.65 5.09 11.33 5 12 5Z' />
		<path d='M8 14v.5' />
		<path d='M16 14v.5' />
		<path d='M11.25 16.25h1.5L12 17z' />
	</svg>
);
