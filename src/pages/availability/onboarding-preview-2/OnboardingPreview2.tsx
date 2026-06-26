import {
	CheckSuccess,
	Google,
	Info,
	Jupiter,
	Send,
	TriangleAlert,
} from '@psycron/components/icons';

import { AvailabilityWorkspaceRouteFrame } from '../workspace/AvailabilityWorkspaceRouteFrame';

import {
	COMPONENT_MAP,
	DATA_TAG_GROUPS,
	FLOW_TEMPLATES,
	INVENTORY_SECTIONS,
	SOURCE_PREVIEW,
} from './OnboardingPreview2.constants';
import {
	ComponentCard,
	ComponentDescription,
	ComponentGrid,
	ComponentName,
	ComponentSource,
	ComponentTopline,
	ConversationPreview,
	ExistingText,
	Eyebrow,
	FlowCard,
	FlowGrid,
	FlowName,
	FlowPath,
	HeroBand,
	HeroCopy,
	LeadText,
	LevelBadge,
	MapCard,
	MapGrid,
	MapName,
	MapRoute,
	MapUse,
	MiniAvatar,
	MiniBubble,
	MiniChip,
	MiniDock,
	MiniMessage,
	MiniStack,
	MiniStatus,
	PageTitle,
	PreviewCardSample,
	PreviewPageRoot,
	PreviewSampleHeader,
	PreviewSampleRow,
	PreviewSampleRows,
	PreviewSampleTitle,
	PreviewStatusPill,
	PublishSampleButton,
	ReferencePanel,
	RowDot,
	RowLabel,
	RowValue,
	Section,
	SectionDescription,
	SectionHeader,
	SectionTitle,
	SectionTitleGroup,
	SourceLabel,
	SourceLink,
	SourcePanel,
	SourcePath,
	SpecItem,
	SpecList,
	StatCard,
	StatLabel,
	StatsGrid,
	StatValue,
	TagPill,
	TagWrap,
} from './OnboardingPreview2.styles';

const previewRows = [
	{ label: 'Calendar', tone: 'blue' as const, value: 'Gustavo (Primary)' },
	{ label: 'Days', tone: 'purple' as const, value: 'Mon, Wed, Thu, Fri' },
	{ label: 'Hours', tone: 'green' as const, value: '09:00-18:30' },
	{ label: 'Repeats', tone: 'yellow' as const, value: 'Weekly' },
];

export const OnboardingPreview2 = () => {
	const totalItems = INVENTORY_SECTIONS.reduce(
		(count, section) => count + section.items.length,
		0
	);
	const totalTags = DATA_TAG_GROUPS.reduce(
		(count, group) => count + group.tags.length,
		0
	);

	return (
		<AvailabilityWorkspaceRouteFrame
			subtitle='Component inventory for the new Jupiter onboarding flow.'
			title='Jupiter onboarding preview'
		>
			<PreviewPageRoot
				data-testid='availability-preview-2-root'
				id='availability-preview-2-root'
			>
				<HeroBand>
					<HeroCopy>
						<Eyebrow>Atomic design board</Eyebrow>
						<PageTitle>
							Components and atomization for the Jupiter onboarding page.
						</PageTitle>
						<LeadText>
							This React page reads the local interactive mock as the reference
							and turns it into an implementation inventory: electrons, atoms,
							molecules, organisms, templates, and the final page route.
						</LeadText>
					</HeroCopy>

					<SourcePanel data-testid='availability-preview-2-source'>
						<div>
							<SourceLabel>Reference document</SourceLabel>
							<SourcePath>{SOURCE_PREVIEW.label}</SourcePath>
						</div>
						<SourceLink href={SOURCE_PREVIEW.href}>
							Open local HTML reference
						</SourceLink>
					</SourcePanel>
				</HeroBand>

				<StatsGrid aria-label='Onboarding preview inventory summary'>
					<StatCard>
						<StatValue>{INVENTORY_SECTIONS.length}</StatValue>
						<StatLabel>Atomic levels mapped</StatLabel>
					</StatCard>
					<StatCard>
						<StatValue>{totalItems}</StatValue>
						<StatLabel>Component decisions listed</StatLabel>
					</StatCard>
					<StatCard>
						<StatValue>{totalTags}</StatValue>
						<StatLabel>Data-tag groups covered</StatLabel>
					</StatCard>
					<StatCard>
						<StatValue>{COMPONENT_MAP.length}</StatValue>
						<StatLabel>Existing React sources linked</StatLabel>
					</StatCard>
				</StatsGrid>

				<Section aria-labelledby='availability-preview-2-reference-title'>
					<SectionHeader>
						<SectionTitleGroup>
							<Eyebrow>Reference slice</Eyebrow>
							<SectionTitle id='availability-preview-2-reference-title'>
								How the mock decomposes visually
							</SectionTitle>
							<SectionDescription>
								The sample below is not a second onboarding flow. It shows the
								key composition rules from the HTML: grouped bubbles,
								explanatory notes, chips, composer affordance, and the final
								availability preview card.
							</SectionDescription>
						</SectionTitleGroup>
					</SectionHeader>

					<ReferencePanel>
						<ConversationPreview>
							<MiniMessage>
								<MiniAvatar aria-hidden='true'>
									<Jupiter />
								</MiniAvatar>
								<MiniStack>
									<MiniBubble>
										Hi, I am Jupiter. Let us set up your availability.
									</MiniBubble>
									<MiniBubble isJoined>
										Should this repeat weekly or monthly?
									</MiniBubble>
									<MiniStatus>
										<Info />
										<span>
											Weekly means these same times repeat every week.
											Monthly is better for occasional clinic days.
										</span>
									</MiniStatus>
								</MiniStack>
							</MiniMessage>

							<MiniMessage isUser>
								<MiniStack isUser>
									<MiniBubble isUser>Weekly</MiniBubble>
								</MiniStack>
							</MiniMessage>

							<MiniDock>
								<MiniChip tone='blue'>
									<Google />
									Connect Google
								</MiniChip>
								<MiniChip tone='purple'>
									<CheckSuccess />
									Weekly
								</MiniChip>
								<MiniChip tone='neutral'>
									<Send />
									Custom time
								</MiniChip>
							</MiniDock>
						</ConversationPreview>

						<PreviewCardSample>
							<PreviewSampleHeader>
								<PreviewSampleTitle>Your availability</PreviewSampleTitle>
								<PreviewStatusPill>Imported from Google</PreviewStatusPill>
							</PreviewSampleHeader>
							<PreviewSampleRows>
								{previewRows.map((row) => (
									<PreviewSampleRow key={row.label}>
										<RowDot tone={row.tone} />
										<RowLabel>{row.label}</RowLabel>
										<RowValue>{row.value}</RowValue>
									</PreviewSampleRow>
								))}
							</PreviewSampleRows>
							<MiniStatus>
								<TriangleAlert />
								<span>
									Publish copy and disabled state must follow the source and
									publishing status.
								</span>
							</MiniStatus>
							<PublishSampleButton>Publish imported availability</PublishSampleButton>
						</PreviewCardSample>
					</ReferencePanel>
				</Section>

				<Section aria-labelledby='availability-preview-2-existing-title'>
					<SectionHeader>
						<SectionTitleGroup>
							<Eyebrow>Reuse first</Eyebrow>
							<SectionTitle id='availability-preview-2-existing-title'>
								Existing React components to use
							</SectionTitle>
							<SectionDescription>
								These are the current components and page modules that map
								directly to the HTML mock. New abstractions should be extracted
								only where the same pattern appears in more than one place.
							</SectionDescription>
						</SectionTitleGroup>
					</SectionHeader>

					<MapGrid>
						{COMPONENT_MAP.map((item) => (
							<MapCard key={item.name}>
								<MapName>{item.name}</MapName>
								<MapRoute>{item.route}</MapRoute>
								<MapUse>{item.use}</MapUse>
							</MapCard>
						))}
					</MapGrid>
				</Section>

				{INVENTORY_SECTIONS.map((section) => (
					<Section
						key={section.level}
						aria-labelledby={`availability-preview-2-${section.shortName}`}
					>
						<SectionHeader>
							<SectionTitleGroup>
								<Eyebrow>{section.shortName}</Eyebrow>
								<SectionTitle id={`availability-preview-2-${section.shortName}`}>
									{section.level}
								</SectionTitle>
								<SectionDescription>{section.description}</SectionDescription>
							</SectionTitleGroup>
							<LevelBadge tone={section.tone}>{section.items.length} items</LevelBadge>
						</SectionHeader>

						<ComponentGrid>
							{section.items.map((item) => (
								<ComponentCard key={item.name} tone={section.tone}>
									<ComponentTopline>
										<ComponentName>{item.name}</ComponentName>
										<LevelBadge tone={section.tone}>{section.level}</LevelBadge>
									</ComponentTopline>
									<ComponentDescription>{item.description}</ComponentDescription>
									<ComponentSource>{item.source}</ComponentSource>
									<ExistingText>{item.existing}</ExistingText>
									<SpecList>
										{item.notes.map((note) => (
											<SpecItem key={note}>{note}</SpecItem>
										))}
									</SpecList>
									<TagWrap>
										{item.tags.map((tag) => (
											<TagPill key={tag}>{tag}</TagPill>
										))}
									</TagWrap>
								</ComponentCard>
							))}
						</ComponentGrid>
					</Section>
				))}

				<Section aria-labelledby='availability-preview-2-flows-title'>
					<SectionHeader>
						<SectionTitleGroup>
							<Eyebrow>Journey templates</Eyebrow>
							<SectionTitle id='availability-preview-2-flows-title'>
								Flow states from the reference mock
							</SectionTitle>
							<SectionDescription>
								These paths are the templates the implementation should support
								before styling details are finalized.
							</SectionDescription>
						</SectionTitleGroup>
					</SectionHeader>

					<FlowGrid>
						{FLOW_TEMPLATES.map((flow) => (
							<FlowCard key={flow.name}>
								<FlowName>{flow.name}</FlowName>
								<FlowPath>{flow.path}</FlowPath>
								<SpecList>
									{flow.states.map((state) => (
										<SpecItem key={state}>{state}</SpecItem>
									))}
								</SpecList>
							</FlowCard>
						))}
					</FlowGrid>
				</Section>

				<Section aria-labelledby='availability-preview-2-tags-title'>
					<SectionHeader>
						<SectionTitleGroup>
							<Eyebrow>Testing hooks</Eyebrow>
							<SectionTitle id='availability-preview-2-tags-title'>
								Data-tag coverage from the HTML
							</SectionTitle>
							<SectionDescription>
								The mock uses data-tags as implementation anchors. The React
								build should preserve the same intent with stable data-testid
								names where production tests need them.
							</SectionDescription>
						</SectionTitleGroup>
					</SectionHeader>

					<MapGrid>
						{DATA_TAG_GROUPS.map((group) => (
							<MapCard key={group.name}>
								<MapName>{group.name}</MapName>
								<MapUse>{group.description}</MapUse>
								<TagWrap>
									{group.tags.map((tag) => (
										<TagPill key={tag}>{tag}</TagPill>
									))}
								</TagWrap>
							</MapCard>
						))}
					</MapGrid>
				</Section>
			</PreviewPageRoot>
		</AvailabilityWorkspaceRouteFrame>
	);
};
