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
          `px-3 py-1 rounded-sm font-mono text-sm border transition-colors ${
            isActive
              ? "bg-accent text-bg border-accent"
              : "border-divider text-text/70 hover:border-accent hover:text-text"
          }`
        }
      >
        Statistics
      </NavLink>
    </nav>
  );
}
