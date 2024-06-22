export interface Item {
  name: string;
}

export interface NestedItem extends Item {
  children?: Item[];
  components?: Item[];
}

export interface DesignSystemCategory {
  description: string;
  icon: React.ReactElement;
  items?: NestedItem[];
  title: string;
}

export type DesignSystem = DesignSystemCategory[];
