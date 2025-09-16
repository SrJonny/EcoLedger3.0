import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/activities/activities-list',
    label: 'Activities',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiRun' in icon ? icon['mdiRun' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_ACTIVITIES'
  },
  {
    href: '/dashboards/dashboards-list',
    label: 'Dashboards',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiViewDashboard' in icon ? icon['mdiViewDashboard' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_DASHBOARDS'
  },
  {
    href: '/goals/goals-list',
    label: 'Goals',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFlagCheckered' in icon ? icon['mdiFlagCheckered' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_GOALS'
  },
  {
    href: '/reports/reports-list',
    label: 'Reports',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileDocumentOutline' in icon ? icon['mdiFileDocumentOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_REPORTS'
  },
  {
    href: '/tokens/tokens-list',
    label: 'Tokens',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCurrencyUsd' in icon ? icon['mdiCurrencyUsd' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_TOKENS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
