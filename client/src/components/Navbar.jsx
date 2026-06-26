import { FiMenu, FiMoon, FiSearch, FiSun, FiUser } from "react-icons/fi";

function Navbar({ pageTitle, theme, searchTerm, onSearchChange, onThemeToggle, onMenuClick }) {
    return (
        <header className="navbar">
            <div className="navbar-title">
                <button type="button" className="icon-button mobile-menu-button" onClick={onMenuClick} aria-label="Open menu">
                    <FiMenu />
                </button>
                <div>
                    <span className="eyebrow">AS Publications</span>
                    <h1>{pageTitle}</h1>
                </div>
            </div>

            <div className="navbar-actions">
                <label className="search-field">
                    <FiSearch />
                    <input
                        type="search"
                        placeholder="Search books"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </label>

                <button type="button" className="icon-button" onClick={onThemeToggle} aria-label="Toggle theme">
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>

                <div className="admin-profile" aria-label="Admin profile">
                    <FiUser />
                    <span>Admin</span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
