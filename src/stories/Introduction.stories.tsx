/* eslint-disable react/no-unescaped-entities */
import {
	Box,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { palette } from '@psycron/theme/palette/palette.theme';
import { type Meta } from '@storybook/react';
import {
	AppWindow,
	Atom,
	BoxesIcon,
	BoxIcon,
	Component,
	LayoutTemplate,
	Package,
} from 'lucide-react';

import { ImgCredits, NoteCard, StoryLink } from './Introduction.styles';
import type { DesignSystem } from './Introduction.types';

export default {
	title: 'Introduction',
} as Meta;

export const Introduction = () => {
	const designSystem: DesignSystem = [
		{
			title: 'Elements',
			icon: <Atom color={palette.secondary.main} />,
			description: 'Basic building blocks for creating components.',
			items: [
				{ name: 'button' },
				{ name: 'checkbox' },
				{ name: 'link' },
				{ name: 'radio' },
				{ name: 'select' },
				{ name: 'slider' },
				{ name: 'switch' },
				{ name: 'tooltip' },
			],
		},
		{
			title: 'Components',
			icon: <Component color={palette.primary.main} />,
			description:
        'Multiple elements working harmoniously to craft visually stunning, reusable pieces!',
			items: [
				{ name: 'card' },
				{
					name: 'form',
					children: [
						{ name: 'addpatient' },
						{ name: 'signin' },
						{ name: 'signup' },
					],
					components: [
						{ name: 'address-form' },
						{ name: 'contacts' },
						{ name: 'name-form' },
						{ name: 'password-input' },
						{ name: 'phone-input' },
					],
				},
			],
		},
		{
			title: 'Layouts',
			icon: <LayoutTemplate color={palette.tertiary.main} />,
			description:
        'Frameworks that provide the skeleton for organizing components and creating...',
		},
		{
			title: 'Pages',
			icon: <AppWindow color={palette.info.main} />,
			description:
        'Complete compositions of elements, components, and structures.',
		},
	];

	return (
		<Box style={{ padding: '20px' }}>
			<Box display='flex' alignItems='center' px={4} mb={5}>
				<img src='/images/img4.png' height={150} loading='lazy' />
				<Box>
					<Typography variant='h4' fontWeight={700} textAlign='center'>
            Welcome to the<Link to={'http://psycron.app'}>psycron.app</Link>
            Design System
					</Typography>
					<Box p={6}>
						<Typography variant='subtitle1' textAlign='left'>
              Here you can find the list of all elements, components and pages
              that might help you to create the most beautiful UI you can
						</Typography>
					</Box>
				</Box>
				<img src='/images/img3.png' height={150} loading='lazy' />
			</Box>
			<Box>
				<Typography variant='h6' fontWeight={600} gutterBottom>
          Getting Started
				</Typography>
				<Typography variant='body1'>
          To get started, select a component from the sidebar. You can select
          the one you need to debug and get ready to have fun!
				</Typography>
			</Box>
			<NoteCard>
				<Typography textAlign='center' variant='subtitle1'>
          We've crafted our UI library around fundamental web principles. Keep
          it simple, readable, scalable, and reusable.
				</Typography>
			</NoteCard>
			<Box mt={5}>
				<Typography variant='subtitle2' py={5}>
          This translates into our design system being divided into 4 key items:
				</Typography>
				{designSystem.map((item, index) => (
					<ListItem key={index}>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText>
							<Typography variant='h6' fontWeight={600}>
								{item.title}
							</Typography>
							{item.description}
						</ListItemText>
					</ListItem>
				))}
			</Box>
			<Box>
				{designSystem.map((category, index) => (
					<Box key={index} m={2}>
						<ListItem>
							<ListItemText>
								<Typography variant='h4' fontWeight={600}>
									{category.title}
								</Typography>
							</ListItemText>
						</ListItem>
						{category.items ? (
							<>
								{category.items.map((item, itemIndex) => (
									<Box key={itemIndex}>
										<ListItem>
											<Box display='flex' alignItems='center'>
												{item.children ? (
													<Typography
														variant='subtitle1'
														fontWeight={600}
														ml={2}
														textTransform='capitalize'
													>
														{item.name}
													</Typography>
												) : (
													<>
														<BoxIcon />
														<StoryLink
															href={`/?path=/docs/${category.title.toLowerCase()}-${item.name}--docs`}
														>
															<Typography
																variant='subtitle2'
																textTransform='capitalize'
															>
																{item.name}
															</Typography>
														</StoryLink>
													</>
												)}
											</Box>
										</ListItem>
										{item.children ? (
											<>
												{item?.children?.map((child, childIndex) => (
													<ListItem key={`item-children-${childIndex}`}>
														<Box ml={4} display='flex' alignItems='center'>
															<BoxesIcon />
															<StoryLink
																href={`/?path=/docs/${category.title.toLowerCase()}-${item.name.toLowerCase()}-${child.name}--docs`}
															>
																<Typography
																	variant='body2'
																	textTransform='capitalize'
																>
																	{child.name}
																</Typography>
															</StoryLink>
														</Box>
													</ListItem>
												))}
											</>
										) : null}

										{item.components ? (
											<>
												<Typography variant='subtitle2' fontWeight={600} my={4}>
                          Components
												</Typography>
												{item.components.map((component, componentIndex) => (
													<ListItem key={componentIndex}>
														<Box ml={4} display='flex'>
															<Package />
															<StoryLink
																href={`/?path=/docs/${category.title.toLowerCase()}-${item.name.toLowerCase()}-components-${component.name}--docs`}
															>
																<Typography variant='body2'>
																	{component.name}
																</Typography>
															</StoryLink>
														</Box>
													</ListItem>
												))}
											</>
										) : null}
									</Box>
								))}
							</>
						) : null}
					</Box>
				))}
			</Box>
			<Divider />
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				my={6}
			>
				<Typography variant='h4' fontWeight={600}>
          Thank you for being part of it!
				</Typography>
				<img src='/images/img6.png' height={150} loading='lazy' />
			</Box>
			<ImgCredits>
				<Typography>
          Illustrations by
					<a href='https://icons8.com/illustrations/author/zD2oqC8lLBBA'>
            Icons 8
					</a>
          from
					<a href='https://icons8.com/illustrations'>Ouch!</a>
				</Typography>
				<Box>
					<Typography variant='caption' fontWeight={700}>
						<a href='https://icons8.com/illustrations/style--3d-casual-life'>
              Find more here
						</a>
					</Typography>
				</Box>
			</ImgCredits>
		</Box>
	);
};
