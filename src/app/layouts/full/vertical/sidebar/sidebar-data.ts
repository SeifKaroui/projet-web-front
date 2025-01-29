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
  },
  {
    displayName: 'Notes',
    iconName: 'solar:document-text-line-duotone',
    route: 'apps/notes',
  },
  {
    displayName: 'ToDo',
    iconName: 'solar:airbuds-case-minimalistic-line-duotone',
    route: 'apps/todo',
  },
  {
    displayName: 'Taskboard',
    iconName: 'solar:clapperboard-edit-line-duotone',
    route: 'apps/taskboard',
  },
];
