import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/books": "Books",
    "/books/add": "Add Book",
    "/activity": "Activity Log",
    "/settings": "Settings"
};

function AppLayout() {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const pageTitle = useMemo(() => {
        if (location.pathname.startsWith("/books/edit")) {
            return "Edit Book";
        }
        return pageTitles[location.pathname] || "Dashboard";
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="app-shell">
            <Sidebar
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                onLogoutRequest={() => setShowLogoutConfirm(true)}
            />

            <div className="app-main">
                <Navbar
                    pageTitle={pageTitle}
                    theme={theme}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onThemeToggle={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                />
                <main className="page-content">
                    <Outlet context={{ searchTerm, theme, onThemeToggle: () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark") }} />
                </main>
            </div>

            <ConfirmDialog
                open={showLogoutConfirm}
                title="Log out?"
                message="You will need to sign in again to manage the inventory."
                confirmText="Log out"
                danger
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />

            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: "toast-message",
                    duration: 3000
                }}
            />
        </div>
    );
}

export default AppLayout;
