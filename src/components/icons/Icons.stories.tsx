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
  width: 100%;
  height: 100%;
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


const BrandItemWrapper = styled.div`
  margin: 10px;
  text-align: center;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & svg {
    width: 100px;
    height: auto;
  }
`;

const iconsArray = Object.entries(Icons);

const IconList = () => {
	const otherIcons = iconsArray.filter(
		([name]) => name !== 'Logo' && name !== 'Brand'
	);

	return (
		<Wrapper>
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

const BrandIcons = () => {
	const logoIcon = iconsArray.filter(
		([name]) => name === 'Logo' || name === 'Brand'
	);
	return (
		<IconsWrapper>
			{logoIcon.map(([name, Icon]) => (
				<BrandItemWrapper key={name}>
					<Icon />
					<div>{name}</div>
				</BrandItemWrapper>
			))}
		</IconsWrapper>
	);
};

const meta: Meta = {
	title: 'Icons',
	component: IconList,
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => <IconList />,
};

export const Brand: Story = {
	render: () => <BrandIcons />,
};
