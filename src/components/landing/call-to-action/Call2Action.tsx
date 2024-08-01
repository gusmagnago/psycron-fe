import { Trans } from 'react-i18next';
import { palette } from '@psycron/theme/palette/palette.theme';

import { Text } from '@psycron/components/text/Text';
import {
  BGWrapper,
  Call2ActionFooterItem,
  Call2ActionFooterWrapper,
  Call2ActionInputWrapper,
  Heading,
  StyledDescriptionWrapper,
} from './Call2Action.styles';

import { ICall2ActionSection } from './Call2Action.types';

export const Call2ActionSection = ({
  c2Action,
  headingText,
  i18nextTrans,
}: ICall2ActionSection) => {
  return (
    <BGWrapper id='join-now'>
      <Call2ActionFooterWrapper>
        <Call2ActionFooterItem>
          <Heading variant='h2' isFirstUpper>
            {headingText}
          </Heading>
          <StyledDescriptionWrapper>
            <Text
              variant='body2'
              fontSize={'1rem'}
              color={palette.gray['08']}
              textAlign={'left'}
            >
              <Trans i18nKey={i18nextTrans} />
            </Text>
          </StyledDescriptionWrapper>
        </Call2ActionFooterItem>
      </Call2ActionFooterWrapper>
      <Call2ActionInputWrapper>{c2Action}</Call2ActionInputWrapper>
    </BGWrapper>
  );
};
