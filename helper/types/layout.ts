import { JSX } from 'react'

export interface SidebarMenuObj {
  path: string
  icon: JSX.Element // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
  pageName: string
  pageTitle: string
  submenu?: SubmenuItem[]
}
export interface SubmenuItem {
  path: string
  icon: any // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
  pageName: string
  pageTitle: string
}

export interface SidebarSubmenuProps {
  path: string
  icon: JSX.Element // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
  pageName: string
  submenu?: SubmenuItem[]
}

export interface SubmenuItem {
  path: string
  icon: any // Change this to typeof Squares2X2Icon | typeof InboxArrowDownIcon | ...
  pageName: string
}
