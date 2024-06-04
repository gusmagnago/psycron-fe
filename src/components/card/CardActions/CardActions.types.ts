export type CardActionsProps = {
    actionName: string
    hasTertiary?: boolean;
    onClick: () => void,
    secondAction?: () => void,
    secondActionName?: string;
    tertiaryAction?: () => void,
    tertiaryActionName?: string;
}