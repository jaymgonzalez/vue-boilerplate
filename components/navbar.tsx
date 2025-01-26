import { Bars3Icon } from '@heroicons/react/24/solid'

export default function Navbar() {
  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <label htmlFor="left-sidebar-drawer">
          <div
            role="button"
            className="btn btn-ghost btn-circle drawer-button lg:hidden"
          >
            <Bars3Icon className="size-6" />
          </div>
        </label>
      </div>
      <div className="navbar-center">
        <a className="text-xl">HyperTrader</a>
      </div>
      <div className="navbar-end"></div>
    </div>
  )
}
