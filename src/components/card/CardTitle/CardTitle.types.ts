export type CardTitleProps = {
    firstChip?: () => void;
    firstChipName?: string;
    hasFirstChip?: boolean;
    hasSecondChip?: boolean;
    secondChip?: () => void;
    secondChipName?: string;
    subheader?: string;
    title: string;
}
