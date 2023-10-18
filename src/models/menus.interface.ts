export interface Menus {
  title?: string;
  icon?: string;
  url?: string;
  children?: Menus[];
  active?: boolean;
}
