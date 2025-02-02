import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Dashboard',
  },
  {
    displayName: 'Calendar',
    iconName: 'solar:calendar-mark-line-duotone',
    route: 'apps/calendar',
  },

  {
    displayName: 'Courses',
    iconName: 'solar:book-bookmark-line-duotone',
    route: 'apps/courses',
  }
];
