export type StatusNoteType = 'google' | 'info' | 'success' | 'warning';

export interface StatusNoteProps {
	id?: string;
	testId: string;
	text: string;
	type?: StatusNoteType;
}
