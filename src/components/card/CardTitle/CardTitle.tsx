import { Box, Grid } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';

import { CardTitleWrapper, TitleWrapper } from './CardTitle.styles';
import type { CardTitleProps } from './CardTitle.types';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

export const CardTitle = ({
  title,
  subheader,
  firstChip,
  firstChipName,
  hasFirstChip,
  hasSecondChip,
  secondChip,
  secondChipName,
  firstChipTooltip,
}: CardTitleProps) => {
  return (
    <CardTitleWrapper>
      <Grid
        container
        columns={12}
        justifyContent='space-between'
        alignItems='center'
      >
        <Grid item xs={8}>
          <TitleWrapper>
            <Text variant='h5' isFirstUpper>
              {title}
            </Text>
            {subheader?.length ? (
              <Text
                variant='subtitle1'
                color={palette.text.secondary}
                isFirstUpper
              >
                {subheader}
              </Text>
            ) : null}
          </TitleWrapper>
        </Grid>
        {hasFirstChip ? (
          <Grid item xs={4} display='flex' justifyContent='flex-end'>
            {firstChipName ? (
              typeof firstChipName === 'string' ? (
                <Box>
                  <Button onClick={firstChip} small>
                    {firstChipName}
                  </Button>
                </Box>
              ) : (
                <Tooltip title={firstChipTooltip}>{firstChipName}</Tooltip>
              )
            ) : null}
            {hasSecondChip ? (
              <Box pl={2}>
                <Button onClick={secondChip} small secondary>
                  {secondChipName}
                </Button>
              </Box>
            ) : null}
          </Grid>
        ) : null}
      </Grid>
    </CardTitleWrapper>
  );
};
