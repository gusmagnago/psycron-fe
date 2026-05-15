import { Modal } from '@mui/material';
import { Close } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { AnimatePresence } from 'framer-motion';

import { bentoTileModalVariants } from '../BentoTile.motion';
import {
	BentoTileExpandedBody,
	BentoTileExpandedFooter,
	BentoTileExpandedHeader,
	BentoTileHeaderIcon,
	BentoTileHeaderIdentity,
	BentoTileHeaderTitle,
	BentoTileModalFrame,
	BentoTileModalPanel,
	TileControlIconWrap,
} from '../BentoTile.styles';
import type { BentoTileExpandedModalProps } from '../BentoTile.types';

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
