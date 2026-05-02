import { Link } from "react-router-dom"
import { useState } from "react"
import logo from '../assets/logo.webp'
import NotificationPanel from './NotificationPanel'
import { useNotificationContext } from '../context/NotificationContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAllRead, markOneRead, clearAll } = useNotificationContext()

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-pink-700 to-fuchsia-700 text-white shadow-xl backdrop-blur-md ">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

    {/* Logo */}
    <div className="flex items-center gap-3">
      <img
        className="h-10 w-10 object-contain rounded-lg shadow-md bg-white/90 p-1"
        src={logo}
        alt="Logo"
      />
      <span className="text-lg font-semibold tracking-wide  sm:block">
        Productivity Dashboard
      </span>
    </div>

    {/* Desktop Links */}
     <div className="hidden md:flex gap-8 text-lg font-bold flex-grow justify-end">
           <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded" to="/">
             Dashboard
           </Link>
           <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded" to="/tasks">
             Tasks
           </Link>
           <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded" to="/tasks/new">
             Add Task
           </Link>
         </div>


    {/* Right — Bell + Hamburger */}
    <div className="flex items-center gap-3">
      {/* Notification Bell */}
      <NotificationPanel
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onMarkOneRead={markOneRead}
        onClearAll={clearAll}
      />

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-2xl p-2 rounded-md
                   hover:bg-white/20 transition"
        aria-label="Open Menu"
      >
        ☰
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {open && (
    <div className="md:hidden px-6 pb-6 pt-2 space-y-3 text-base font-bold bg-gradient-to-b from-pink-700 to-fuchsia-700">
      <Link
        onClick={() => setOpen(false)}
        to="/"
        className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
      >
        Dashboard
      </Link>
      <Link
        onClick={() => setOpen(false)}
        to="/tasks"
        className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
      >
        Tasks
      </Link>
      <Link
        onClick={() => setOpen(false)}
        to="/tasks/new"
        className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
      >
        Add Task
      </Link>
    </div>
  )}
</nav>

  )
}
