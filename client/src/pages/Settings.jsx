import { useOutletContext } from "react-router-dom";
import { FiMoon, FiShield, FiSun } from "react-icons/fi";
import "./Settings.css";

function Settings() {
    const { theme, onThemeToggle } = useOutletContext() || {};

    return (
        <section className="page-section fade-in">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Workspace</p>
                    <h2>Settings</h2>
                </div>
            </div>

            <div className="settings-grid">
                <article className="panel settings-panel">
                    <div className="settings-panel-header">
                        <div className="settings-icon">
                            {theme === "dark" ? <FiMoon /> : <FiSun />}
                        </div>
                        <div>
                            <h3>Appearance</h3>
                            <p>Choose the dashboard theme.</p>
                        </div>
                    </div>

                    <button type="button" className="theme-segment" onClick={onThemeToggle}>
                        <span className={theme === "light" ? "active" : ""}>
                            <FiSun />
                            Light
                        </span>
                        <span className={theme === "dark" ? "active" : ""}>
                            <FiMoon />
                            Dark
                        </span>
                    </button>
                </article>

                <article className="panel settings-panel">
                    <div className="settings-panel-header">
                        <div className="settings-icon emerald">
                            <FiShield />
                        </div>
                        <div>
                            <h3>Access</h3>
                            <p>Protected by the existing admin login.</p>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default Settings;
