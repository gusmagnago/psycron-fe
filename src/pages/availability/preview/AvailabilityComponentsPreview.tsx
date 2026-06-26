import { Button } from '@psycron/components/button/Button';
import { CheckSuccess, Google, Jupiter } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { AnimatedEllipsisText } from '../jupiter-conversation/animated-ellipsis-text/AnimatedEllipsisText';
import {
	BotBubble,
	UserBubble,
} from '../jupiter-conversation/JupiterConversation.styles';
import { JupiterThinking } from '../jupiter-conversation/JupiterThinking';
import { StatusNote } from '../jupiter-conversation/status-note/StatusNote';

import {
	AtomLabel,
	AtomRow,
	AtomStage,
	AvatarAtom,
	BoxShellAtom,
	CalendarBadge,
	CalendarOptionAtom,
	ChipAtom,
	DockAtom,
	DoneAtom,
	Dot,
	PermissionItemAtom,
	PreviewPage,
	PreviewPublishButton,
	PreviewResetButton,
	PreviewRowAtom,
	PreviewRowLabel,
	PreviewRowValue,
	PreviewSection,
	PreviewSubtitle,
	PreviewTitle,
	SectionTitle,
	SenderLabel,
	StatusPillAtom,
} from './AvailabilityComponentsPreview.styles';
import { ComposerDemo } from './ComposerDemo';
import { FullViewExample } from './FullViewExample';
import { TypewriterText } from './TypewriterText';

// Storybook-style catalog of the Jupiter onboarding building blocks, mirroring
// /tmp/psycron-jupiter-onboarding-preview.html. Components are grouped by list
// and shown statically (no data wiring) using production theme tokens.
export const AvailabilityComponentsPreview = () => {
	return (
		<PreviewPage
			data-testid='availability-preview-root'
			id='availability-preview-root'
		>
			<PreviewTitle>Jupiter onboarding — component catalog</PreviewTitle>
			<PreviewSubtitle>
				The building blocks used by the onboarding prototype, grouped by list and
				rendered statically with Psycron theme tokens. No data, no page
				composition — just the components that will be used.
			</PreviewSubtitle>

			<PreviewSection>
				<SectionTitle>Messages</SectionTitle>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-avatar</AtomLabel>
					<AtomStage>
						<AvatarAtom>
							<Jupiter />
						</AvatarAtom>
						<SenderLabel>Jupiter</SenderLabel>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-bubble-bot</AtomLabel>
					<AtomStage>
						<BotBubble isFirst isLast>
							<TypewriterText text="Hi! I'm Jupiter, your scheduling assistant." />
						</BotBubble>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-bubble-user</AtomLabel>
					<AtomStage>
						<UserBubble isFirst isLast>
							Connect Google Calendar
						</UserBubble>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-thinking</AtomLabel>
					<AtomStage>
						<JupiterThinking />
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>animated-ellipsis</AtomLabel>
					<AtomStage>
						<BotBubble isFirst isLast>
							<AnimatedEllipsisText text='Importing your schedule…' />
						</BotBubble>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Status notes</SectionTitle>

				<AtomRow>
					<AtomLabel>status-note · info</AtomLabel>
					<AtomStage>
						<StatusNote
							testId='preview-note-info'
							type='info'
							text='Only selected days become patient-bookable.'
						/>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>status-note · success (import flag)</AtomLabel>
					<AtomStage>
						<StatusNote
							testId='preview-note-success'
							type='success'
							text='Imported from Gustavo (Primary)'
						/>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>status-note · warning</AtomLabel>
					<AtomStage>
						<StatusNote
							testId='preview-note-warning'
							type='warning'
							text='Timezone protects bookings across daylight-saving changes.'
						/>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>status-note · google</AtomLabel>
					<AtomStage>
						<StatusNote
							testId='preview-note-google'
							type='google'
							text='Google access lets Psycron detect busy time.'
						/>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Chips</SectionTitle>

				<AtomRow>
					<AtomLabel>chip · variants</AtomLabel>
					<AtomStage>
						<ChipAtom type='button'>Default</ChipAtom>
						<ChipAtom type='button' chipVariant='primary'>
							Primary
						</ChipAtom>
						<ChipAtom type='button' chipVariant='google'>
							<Google />
							Connect Google
						</ChipAtom>
						<ChipAtom type='button' chipVariant='success'>
							Yes, that&apos;s right
						</ChipAtom>
						<ChipAtom type='button' chipVariant='danger'>
							No, change it
						</ChipAtom>
						<ChipAtom type='button' chipVariant='selected'>
							Selected
						</ChipAtom>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Inputs</SectionTitle>

				<AtomRow>
					<AtomLabel>composer · send (idle / active)</AtomLabel>
					<AtomStage>
						<ComposerDemo idPrefix='preview-atom' />
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>continue-button</AtomLabel>
					<AtomStage>
						<Button tertiary>Continue</Button>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Permissions</SectionTitle>

				<AtomRow>
					<AtomLabel>google-permission-item</AtomLabel>
					<AtomStage>
						<PermissionItemAtom>
							<CheckSuccess aria-hidden='true' focusable='false' />
							<span>See the times you are busy</span>
						</PermissionItemAtom>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Calendar picker</SectionTitle>

				<AtomRow>
					<AtomLabel>calendar-option</AtomLabel>
					<AtomStage>
						<CalendarOptionAtom>
							<Dot dotColor={palette.brand.purple} />
							Gustavo (Primary)
							<CalendarBadge>Primary</CalendarBadge>
						</CalendarOptionAtom>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Preview card</SectionTitle>

				<AtomRow>
					<AtomLabel>preview-status-pill</AtomLabel>
					<AtomStage>
						<StatusPillAtom>Imported from Google</StatusPillAtom>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>preview-row</AtomLabel>
					<AtomStage>
						<PreviewRowAtom>
							<Dot dotColor={palette.secondary.main} dotSize={10} />
							<PreviewRowLabel>Hours</PreviewRowLabel>
							<PreviewRowValue>09:00 – 18:30</PreviewRowValue>
						</PreviewRowAtom>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>preview-publish · idle / publishing / success / disabled</AtomLabel>
					<AtomStage>
						<PreviewPublishButton type='button' data-publish-state='idle'>
							Publish imported availability
						</PreviewPublishButton>
						<PreviewPublishButton
							type='button'
							data-publish-state='publishing'
							disabled
						>
							Publishing imported availability…
						</PreviewPublishButton>
						<PreviewPublishButton
							type='button'
							data-publish-state='success'
							disabled
						>
							Imported availability published
						</PreviewPublishButton>
						<PreviewPublishButton type='button' disabled>
							Complete required answers
						</PreviewPublishButton>
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>preview-reset</AtomLabel>
					<AtomStage>
						<PreviewResetButton type='button'>
							Review import again
						</PreviewResetButton>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>States</SectionTitle>

				<AtomRow>
					<AtomLabel>onboarding-done</AtomLabel>
					<AtomStage>
						<DoneAtom>Onboarding complete</DoneAtom>
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Containers</SectionTitle>

				<AtomRow>
					<AtomLabel>box-shell (inline card container)</AtomLabel>
					<AtomStage>
						<BoxShellAtom />
					</AtomStage>
				</AtomRow>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-dock</AtomLabel>
					<AtomStage>
						<DockAtom />
					</AtomStage>
				</AtomRow>
			</PreviewSection>

			<PreviewSection>
				<SectionTitle>Full view — atoms composed</SectionTitle>

				<AtomRow>
					<AtomLabel>jupiter-onboarding-root</AtomLabel>
					<AtomStage>
						<FullViewExample />
					</AtomStage>
				</AtomRow>
			</PreviewSection>
		</PreviewPage>
	);
};
