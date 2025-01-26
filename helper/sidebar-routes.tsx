import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import TableCellsIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import { SidebarMenuObj } from '@/helper/types/layout'
import { CalendarIcon, FlagIcon } from '@heroicons/react/24/solid'

// Import other icons similarly

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes: SidebarMenuObj[] = [
  {
    path: '/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    pageName: 'Dashboard',
    pageTitle: 'Dashboard',
  },
  {
    path: '/dashboard/trades',
    icon: <WalletIcon className={iconClasses} />,
    pageName: 'Trades',
    pageTitle: 'Trades',
  },
  {
    path: '/dashboard/positions',
    icon: <FlagIcon className={iconClasses} />,
    pageName: 'Positions',
    pageTitle: '',
  },
  {
    path: '/dashboard/calendar',
    icon: <CalendarIcon className={iconClasses} />,
    pageName: 'Calendar',
    pageTitle: '',
  },
]

export default routes
