export type CardActionsProps = {
    actionName: string
    hasSecondAction?: boolean;
    hasTertiary?: boolean;
    onClick: () => void,
    secondAction?: () => void,
    secondActionName?: string;
    tertiaryAction?: () => void,
    tertiaryActionName?: string;
}