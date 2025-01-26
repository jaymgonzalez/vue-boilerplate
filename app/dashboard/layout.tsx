import Navbar from '@/components/navbar'
import LeftSidebar from '@/components/left-sidebar'
import { ReactNode } from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input
          id="left-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          <Navbar />
          {children}
        </div>

        <LeftSidebar />
      </div>
    </div>
  )
}
