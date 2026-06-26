import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBookOpen, FiLogOut, FiSettings, FiX } from "react-icons/fi";
import logo from "../assets/as-publications-logo.png";
import "./Sidebar.css";

function Sidebar({ isMobileOpen, onCloseMobile, onLogoutRequest }) {
    return (
        <>
            <aside className={isMobileOpen ? "Sidebar mobile-open" : "Sidebar"}>
                <div className="sidebar-header">
                    <div className="brand-mark">
                        <img src={logo} alt="AS Publications" />
                    </div>
                    <span>AS Publications</span>
                    <button type="button" className="sidebar-close" onClick={onCloseMobile} aria-label="Close menu">
                        <FiX />
                    </button>
                </div>

                <nav className="sidebar-nav" aria-label="Primary navigation">
                    <NavLink to="/dashboard" className="sidebar-link" onClick={onCloseMobile}>
                        <FiBarChart2 />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/books" className="sidebar-link" end onClick={onCloseMobile}>
                        <FiBookOpen />
                        <span>Books</span>
                    </NavLink>
                    <NavLink to="/settings" className="sidebar-link" onClick={onCloseMobile}>
                        <FiSettings />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <button type="button" className="sidebar-link logout-link" onClick={onLogoutRequest}>
                    <FiLogOut />
                    <span>Log Out</span>
                </button>
            </aside>
            {isMobileOpen && <button type="button" className="sidebar-scrim" onClick={onCloseMobile} aria-label="Close menu" />}
        </>
    );
}
export default Sidebar;
