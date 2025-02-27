import { NavItem } from './nav-item/nav-item';

export const navItems: any[] = [
  {
    id: 1,
    name: 'Dashboard',
    children: [
      { navCap: 'Dashboards' },
      {
        displayName: 'Dashboard 1',
        iconName: 'solar:widget-add-line-duotone',
        route: '/dashboards/dashboard1',
      },
      {
        displayName: 'Dashboard 2',
        iconName: 'solar:chart-line-duotone',
        route: '/dashboards/dashboard2',
      },
      {
        displayName: 'Dashboard 3',
        iconName: 'solar:screencast-2-line-duotone',
        route: '/dashboards/dashboard3',
      },
      { divider: true, navCap: 'Apps' },
      {
        displayName: 'Chat',
        iconName: 'solar:chat-round-line-line-duotone',
        route: 'apps/chat',
      },
      {
        displayName: 'Calendar',
        iconName: 'solar:calendar-mark-line-duotone',
        route: 'apps/calendar',
      },
      {
        displayName: 'Email',
        iconName: 'solar:letter-line-duotone',
        route: 'apps/email/inbox',
      },
      {
        displayName: 'Contacts',
        iconName: 'solar:phone-line-duotone',
        route: 'apps/contacts',
      },
      {
        displayName: 'Courses',
        iconName: 'solar:book-bookmark-line-duotone',
        route: 'apps/courses',
      },
      {
        displayName: 'Employee',
        iconName: 'solar:user-id-line-duotone',
        route: 'apps/employee',
      },
      {
        displayName: 'Notes',
        iconName: 'solar:document-text-line-duotone',
        route: 'apps/notes',
      },
      {
        displayName: 'Tickets',
        iconName: 'solar:ticket-sale-line-duotone',
        route: 'apps/tickets',
      },
      {
        displayName: 'Invoice',
        iconName: 'solar:bill-list-line-duotone',
        route: 'apps/invoice',
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
      {
        displayName: 'Blog',
        iconName: 'solar:widget-4-line-duotone',
        route: 'apps/blog',
        children: [
          {
            displayName: 'Post',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'apps/blog/post',
          },
          {
            displayName: 'Detail',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route:
              'apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Pages',
    children: [
      { navCap: 'Pages' },
      {
        displayName: 'Roll Base Access',
        iconName: 'solar:lock-password-unlocked-line-duotone',
        route: 'apps/permission',
      },
      {
        displayName: 'Treeview',
        iconName: 'solar:bill-line-duotone',
        route: 'theme-pages/treeview',
      },
      {
        displayName: 'Pricing',
        iconName: 'solar:dollar-minimalistic-line-duotone',
        route: 'theme-pages/pricing',
      },
      {
        displayName: 'Account Setting',
        iconName: 'solar:accessibility-line-duotone',
        route: 'theme-pages/account-setting',
      },
      {
        displayName: 'FAQ',
        iconName: 'solar:question-square-line-duotone',
        route: 'theme-pages/faq',
      },
      {
        displayName: 'Landingpage',
        iconName: 'solar:layers-minimalistic-line-duotone',
        route: 'landingpage',
      },
      { divider: true, navCap: 'Widgets' },

      {
        displayName: 'Cards',
        iconName: 'solar:cardholder-line-duotone',
        route: 'widgets/cards',
      },
      {
        displayName: 'Banners',
        iconName: 'solar:align-vertical-spacing-line-duotone',
        route: 'widgets/banners',
      },
      {
        displayName: 'Charts',
        iconName: 'solar:chart-square-line-duotone',
        route: 'widgets/charts',
      },
    ],
  },
  {
    id: 3,
    name: 'Forms',
    children: [
      { navCap: 'Forms' },
      {
        displayName: 'Form elements',
        iconName: 'solar:password-minimalistic-input-line-duotone',
        route: 'forms/forms-elements',
        children: [
          {
            displayName: 'Autocomplete',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'forms/forms-elements/autocomplete',
          },
          {
            displayName: 'Button',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'forms/forms-elements/button',
          },
          {
            displayName: 'Checkbox',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'forms/forms-elements/checkbox',
          },
          {
            displayName: 'Radio',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'forms/forms-elements/radio',
          },
          {
            displayName: 'Datepicker',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: 'forms/forms-elements/datepicker',
          },
        ],
      },
      {
        displayName: 'Form Layouts',
        iconName: 'solar:file-text-line-duotone',
        route: '/forms/form-layouts',
      },
      {
        displayName: 'Form Horizontal',
        iconName: 'solar:align-horizonta-spacing-line-duotone',
        route: '/forms/form-horizontal',
      },
      {
        displayName: 'Form Vertical',
        iconName: 'solar:align-vertical-spacing-line-duotone',
        route: '/forms/form-vertical',
      },
      {
        displayName: 'Form Wizard',
        iconName: 'solar:archive-minimalistic-line-duotone',
        route: '/forms/form-wizard',
      },
    ],
  },
  {
    id: 4,
    name: 'Tables',
    children: [
      { navCap: 'Tables' },
      {
        displayName: 'Basic Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/basic-table',
      },
      {
        displayName: 'Dynamic Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/dynamic-table',
      },
      {
        displayName: 'Expand Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/expand-table',
      },
      {
        displayName: 'Filterable Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/filterable-table',
      },
      {
        displayName: 'Footer Row Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/footer-row-table',
      },
      {
        displayName: 'HTTP Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/http-table',
      },
      {
        displayName: 'Mix Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/mix-table',
      },
      {
        displayName: 'Multi Header Footer',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/multi-header-footer-table',
      },
      {
        displayName: 'Pagination Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/pagination-table',
      },
      {
        displayName: 'Row Context Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/row-context-table',
      },
      {
        displayName: 'Selection Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/selection-table',
      },
      {
        displayName: 'Sortable Table',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/sortable-table',
      },
      {
        displayName: 'Sticky Column',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/sticky-column-table',
      },
      {
        displayName: 'Sticky Header Footer',
        iconName: 'solar:tablet-line-duotone',
        route: 'tables/sticky-header-footer-table',
      },
      { divider: true, navCap: 'Tables' },
      {
        displayName: 'Data table',
        iconName: 'solar:database-line-duotone',
        route: '/datatable/kichen-sink',
      },
    ],
  },
  {
    id: 5,
    name: 'Charts',
    children: [
      { navCap: 'Charts' },
      {
        displayName: 'Line',
        iconName: 'solar:align-top-line-duotone',
        route: '/charts/line',
      },
      {
        displayName: 'Gredient',
        iconName: 'solar:bolt-circle-line-duotone',
        route: '/charts/gredient',
      },
      {
        displayName: 'Area',
        iconName: 'solar:chart-square-line-duotone',
        route: '/charts/area',
      },
      {
        displayName: 'Candlestick',
        iconName: 'solar:align-left-line-duotone',
        route: '/charts/candlestick',
      },
      {
        displayName: 'Column',
        iconName: 'solar:chart-2-line-duotone',
        route: '/charts/column',
      },
      {
        displayName: 'Doughnut & Pie',
        iconName: 'solar:pie-chart-2-line-duotone',
        route: '/charts/doughnut-pie',
      },
      {
        displayName: 'Radialbar & Radar',
        iconName: 'solar:align-vertical-center-line-duotone',
        route: '/charts/radial-radar',
      },
    ],
  },
  {
    id: 6,
    name: 'Ui Components',
    children: [
      { navCap: 'Ui Components' },
      {
        displayName: 'Badge',
        iconName: 'solar:waterdrops-line-duotone',
        route: 'ui-components/badge',
      },
      {
        displayName: 'Expansion Panel',
        iconName: 'solar:tag-horizontal-line-duotone',
        route: 'ui-components/expansion',
      },
      {
        displayName: 'Chips',
        iconName: 'solar:airbuds-case-minimalistic-line-duotone',
        route: 'ui-components/chips',
      },
      {
        displayName: 'Dialog',
        iconName: 'solar:airbuds-case-line-duotone',
        route: 'ui-components/dialog',
      },
      {
        displayName: 'Lists',
        iconName: 'solar:bolt-line-duotone',
        route: 'ui-components/lists',
      },
      {
        displayName: 'Divider',
        iconName: 'solar:box-minimalistic-line-duotone',
        route: 'ui-components/divider',
      },
      {
        displayName: 'Menu',
        iconName: 'solar:feed-line-duotone',
        route: 'ui-components/menu',
      },
      {
        displayName: 'Paginator',
        iconName: 'solar:flag-line-duotone',
        route: 'ui-components/paginator',
      },
      {
        displayName: 'Progress Bar',
        iconName: 'solar:programming-line-duotone',
        route: 'ui-components/progress',
      },
      {
        displayName: 'Progress Spinner',
        iconName: 'solar:waterdrops-line-duotone',
        route: 'ui-components/progress-spinner',
      },
      {
        displayName: 'Ripples',
        iconName: 'solar:text-bold-duotone',
        route: 'ui-components/ripples',
      },
      {
        displayName: 'Slide Toggle',
        iconName: 'solar:balloon-line-duotone',
        route: 'ui-components/slide-toggle',
      },
      {
        displayName: 'Slider',
        iconName: 'solar:slider-minimalistic-horizontal-line-duotone',
        route: 'ui-components/slider',
      },
      {
        displayName: 'Snackbar',
        iconName: 'solar:laptop-minimalistic-line-duotone',
        route: 'ui-components/snackbar',
      },
      {
        displayName: 'Tabs',
        iconName: 'solar:checklist-bold-duotone',
        route: 'ui-components/tabs',
      },
      {
        displayName: 'Toolbar',
        iconName: 'solar:layers-minimalistic-line-duotone',
        route: 'ui-components/toolbar',
      },
      {
        displayName: 'Tooltips',
        iconName: 'solar:align-horizonta-spacing-line-duotone',
        route: 'ui-components/tooltips',
      },
    ],
  },
  {
    id: 7,
    name: 'Authentication Pages',
    children: [
      { navCap: 'Auth' },
      {
        displayName: 'Login',
        iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
        route: '/authentication',
        children: [
          {
            displayName: 'Login 1',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/login',
          },
          {
            displayName: 'Boxed Login',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/boxed-login',
          },
        ],
      },
      {
        displayName: 'Register',
        iconName: 'solar:user-plus-rounded-line-duotone',
        route: '/authentication',
        children: [
          {
            displayName: 'Side Register',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/side-register',
          },
          {
            displayName: 'Boxed Register',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/boxed-register',
          },
        ],
      },
      {
        displayName: 'Forgot Password',
        iconName: 'solar:password-outline',
        route: '/authentication',
        children: [
          {
            displayName: 'Side Forgot Password',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/side-forgot-pwd',
          },
          {
            displayName: 'Boxed Forgot Password',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/boxed-forgot-pwd',
          },
        ],
      },
      {
        displayName: 'Two Steps',
        iconName: 'solar:siderbar-line-duotone',
        route: '/authentication',
        children: [
          {
            displayName: 'Side Two Steps',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/side-two-steps',
          },
          {
            displayName: 'Boxed Two Steps',
            subItemIcon: true,
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/authentication/boxed-two-steps',
          },
        ],
      },
      {
        displayName: 'Error',
        iconName: 'solar:bug-minimalistic-line-duotone',
        route: '/authentication/error',
      },
      {
        displayName: 'Maintenance',
        iconName: 'solar:settings-line-duotone',
        route: '/authentication/maintenance',
      },
    ],
  },
  {
    id: 8,
    name: 'Other',
    children: [
      { navCap: 'Other' },
      {
        displayName: 'Menu Level',
        iconName: 'solar:align-horizontal-center-line-duotone',
        route: '/menu-level',
        children: [
          {
            displayName: 'Menu 1',
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/menu-1',
            children: [
              {
                displayName: 'Menu 1',
                subItemIcon: true,
                iconName: 'solar:round-alt-arrow-right-line-duotone',
                route: '/menu-1',
              },

              {
                displayName: 'Menu 2',
                subItemIcon: true,
                iconName: 'solar:round-alt-arrow-right-line-duotone',
                route: '/menu-2',
              },
            ],
          },

          {
            displayName: 'Menu 2',
            iconName: 'solar:round-alt-arrow-right-line-duotone',
            route: '/menu-2',
          },
        ],
      },
      {
        displayName: 'Disabled',
        iconName: 'solar:bookmark-circle-line-duotone',
        route: '/disabled',
        disabled: true,
      },
      {
        displayName: 'Chip',
        iconName: 'solar:branching-paths-up-line-duotone',
        route: '/',
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: '9',
      },
      {
        displayName: 'Outlined',
        iconName: 'solar:add-square-line-duotone',
        route: '/',
        chip: true,
        chipClass: 'b-1 border-primary text-primary',
        chipContent: 'outlined',
      },
      {
        displayName: 'External Link',
        iconName: 'solar:link-round-angle-bold-duotone',
        route: 'https://www.google.com/',
        external: true,
      },
    ],
  },
];
