import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="flex items-center px-4 py-3 bg-surface border-b border-divider">
      <NavLink to="/" className="font-pixel text-accent text-sm">
        SMAL GAMES HUB
      </NavLink>
    </nav>
  );
}
