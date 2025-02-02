import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Tableau de bord',
  },
  {
    displayName: 'Calendrier',
    iconName: 'solar:calendar-mark-line-duotone',
    route: 'apps/calendar',
  },

  {
    displayName: 'Cours',
    iconName: 'solar:book-bookmark-line-duotone',
    route: 'apps/courses',
  }
];
