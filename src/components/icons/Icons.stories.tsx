import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react';

import * as Icons from './index';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 40px;
`;

const ListItemWrapper = styled.div`
  margin: 10px;
  text-align: center;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  & svg {
    width: 30px;
    height: auto;
  }
`;

const IconList = () => {
	const iconsArray = Object.entries(Icons);
	const logoIcon = iconsArray.filter(([name]) => name === 'Logo' || name === 'Brand' );
	const otherIcons = iconsArray.filter(([name]) => name !== 'Logo' && name !== 'Brand');

	return (
		<Wrapper>
			{logoIcon && (
				<IconsWrapper>
					{logoIcon.map(([name, Icon]) => (
						<ListItemWrapper key={name}>
							<Icon />
							<div>{name}</div>
						</ListItemWrapper>
					))}
				</IconsWrapper>
				
			)}
			<IconsWrapper>
				{otherIcons.map(([name, Icon]) => (
					<ListItemWrapper key={name}>
						<Icon />
						<div>{name}</div>
					</ListItemWrapper>
				))}
			</IconsWrapper>
		</Wrapper>
	);
};

const meta: Meta = {
	title: 'Icons',
	component: IconList,
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => <IconList />,
};
