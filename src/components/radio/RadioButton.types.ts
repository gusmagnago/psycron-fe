export interface IRadioButtonGroup {
  defaultValue?: string;
  formLabel?: string;
  items: { label: string; value: string }[];
  row?: boolean
}
