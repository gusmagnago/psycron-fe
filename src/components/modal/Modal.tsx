import { Card } from '../card/Card';

import { StyledContentWrapper, StyledModal } from './Modal.styles';
import type { IModal } from './Modal.types';

export const Modal = ({
	openModal,
	title,
	children,
	cardActionsProps,
	isLoading,
	cardTitleProps,
	onClose,
	id,
}: IModal) => {
	return (
		<StyledModal open={openModal} onClose={onClose} id={id}>
			<StyledContentWrapper>
				<Card
					cardActionsProps={cardActionsProps}
					cardTitleProps={{
						title: title,
					}}
					onClose={onClose}
					cardTitle={!!title?.length}
					isLoading={isLoading}
					{...cardTitleProps}
				>
					{children}
				</Card>
			</StyledContentWrapper>
		</StyledModal>
	);
};
