import { Link } from "react-router-dom"
import { useState } from "react"
import logo from '../assets/logo.webp'
import NotificationPanel from './NotificationPanel'
import { useNotificationContext } from '../context/NotificationContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAllRead, markOneRead, clearAll } = useNotificationContext()

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-pink-700 to-fuchsia-700 text-white shadow-xl">
      {/* Main navbar row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <img
            className="h-9 w-9 object-contain rounded-lg shadow-md bg-white/90 p-1"
            src={logo}
            alt="Logo"
          />
          <span className="text-base font-semibold tracking-wide">
            Productivity Dashboard
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-base font-bold">
          <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded transition" to="/">
            Dashboard
          </Link>
          <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded transition" to="/tasks">
            Tasks
          </Link>
          <Link className="hover:bg-white hover:text-blue-700 px-3 py-1 rounded transition" to="/tasks/new">
            Add Task
          </Link>
        </div>

        {/* Right side: Bell + Hamburger */}
        <div className="flex items-center gap-2">
          <NotificationPanel
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={markAllRead}
            onMarkOneRead={markOneRead}
            onClearAll={clearAll}
          />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl p-1.5 rounded-md hover:bg-white/20 transition"
            aria-label="Open Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 pt-1 space-y-1 font-bold bg-gradient-to-b from-pink-700 to-fuchsia-700">
          <Link onClick={() => setOpen(false)} to="/"
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/20 transition">
            🏠 Dashboard
          </Link>
          <Link onClick={() => setOpen(false)} to="/tasks"
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/20 transition">
            📋 Tasks
          </Link>
          <Link onClick={() => setOpen(false)} to="/tasks/new"
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/20 transition">
            ➕ Add Task
          </Link>
        </div>
      )}
    </nav>
  )
}
