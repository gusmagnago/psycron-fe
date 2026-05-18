import { Modal } from '@mui/material';
import { Close } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { AnimatePresence } from 'framer-motion';

import { bentoTileModalVariants } from '../../BentoTile.motion';
import {
	BentoTileHeaderIcon,
	BentoTileHeaderIdentity,
	BentoTileHeaderTitle,
	TileControlIconWrap,
} from '../../BentoTile.styles';

import {
	BentoTileExpandedBody,
	BentoTileExpandedFooter,
	BentoTileExpandedHeader,
	BentoTileModalFrame,
	BentoTileModalPanel,
} from './BentoTileExpandedModal.styles';
import type { BentoTileExpandedModalProps } from './BentoTileExpandedModal.types';

export const BentoTileExpandedModal = ({
	closeLabel,
	expandedContent,
	footer,
	icon,
	onClose,
	open,
	title,
}: BentoTileExpandedModalProps) => (
	<Modal closeAfterTransition onClose={onClose} open={open}>
		<BentoTileModalFrame>
			<AnimatePresence>
				{open && expandedContent && (
					<BentoTileModalPanel
						animate='visible'
						exit='exit'
						initial='hidden'
						variants={bentoTileModalVariants}
					>
						<BentoTileExpandedHeader>
							<BentoTileHeaderIdentity>
								{icon && <BentoTileHeaderIcon>{icon}</BentoTileHeaderIcon>}
								{title && <BentoTileHeaderTitle>{title}</BentoTileHeaderTitle>}
							</BentoTileHeaderIdentity>
							<Tooltip
								aria-label={closeLabel}
								onClick={onClose}
								placement='bottom'
								title={closeLabel}
							>
								<TileControlIconWrap>
									<Close height={16} width={16} />
								</TileControlIconWrap>
							</Tooltip>
						</BentoTileExpandedHeader>
						<BentoTileExpandedBody>{expandedContent}</BentoTileExpandedBody>
						{footer && (
							<BentoTileExpandedFooter>{footer}</BentoTileExpandedFooter>
						)}
					</BentoTileModalPanel>
				)}
			</AnimatePresence>
		</BentoTileModalFrame>
	</Modal>
);
