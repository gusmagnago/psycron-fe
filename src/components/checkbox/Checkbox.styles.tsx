import { FormControlLabel, styled } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledFormControlLabel = styled(FormControlLabel, {
	shouldForwardProp: (props) => props !== 'shouldBold',
})<{ shouldBold: boolean }>`
	margin-right: 0;

	.MuiFormControlLabel-label {
		font-weight: ${({ shouldBold }) => (shouldBold ? 500 : 'normal')};
		display: flex;
		font-size: 0.9rem;
		align-items: flex-start;
		padding-right: ${spacing.space};

		${isMobileMedia} {
			padding-right: 0;
		}

		& a {
			padding: 0;
		}
	}

	${isMobileMedia} {
		& span {
			padding: 0;
			padding-right: ${spacing.space};
		}
	}

	.MuiCheckbox-root + div {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.MuiFormControlLabel-asterisk {
		color: ${palette.error.main};
		white-space: nowrap;
	}

	.MuiFormControlLabel-label::first-letter {
		text-transform: uppercase;
	}
`;
