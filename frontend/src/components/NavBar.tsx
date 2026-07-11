import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-surface border-b border-divider">
      <NavLink to="/" className="font-pixel text-accent text-sm">
        SMAL GAMES HUB
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `font-mono text-sm ${isActive ? "text-accent" : "text-text/70 hover:text-text"}`
        }
      >
        Statistics
      </NavLink>
    </nav>
  );
}
