import styled from '@emotion/styled';

export const AnimatedEllipsis = styled('span')`
	display: inline-flex;
	gap: 2px;
	margin-left: 1px;
	vertical-align: baseline;

	& span {
		animation: ellipsisPulse 1.15s infinite ease-in-out;
		line-height: 1;
	}

	& span:nth-of-type(2) {
		animation-delay: 0.16s;
	}

	& span:nth-of-type(3) {
		animation-delay: 0.32s;
	}

	@keyframes ellipsisPulse {
		0%,
		80%,
		100% {
			opacity: 0.28;
			transform: translateY(0);
		}

		40% {
			opacity: 1;
			transform: translateY(-1px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		& span {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
`;
