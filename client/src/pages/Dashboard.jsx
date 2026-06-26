import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiDollarSign, FiPackage, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getDashboardStats } from "../services/dashboard.services";
import "./Dashboard.css";

const statIcons = [FiBookOpen, FiPackage, FiDollarSign, FiTrendingUp];

const formatLabel = (key) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                if (isMounted) {
                    setStats(data);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to load dashboard statistics");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, []);

    const statCards = useMemo(() => {
        const source = stats?.stats || stats || {};
        return Object.entries(source).filter(([, value]) => typeof value !== "object");
    }, [stats]);

    return(
        <section className="page-section fade-in">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Inventory overview</p>
                    <h2>Current backend statistics</h2>
                </div>
                <p className="section-note">Live values from your existing backend.</p>
            </div>

            {isLoading ? (
                <div className="stats-grid">
                    {[1, 2, 3].map((item) => (
                        <div className="stat-card skeleton-card" key={item}>
                            <span />
                            <strong />
                        </div>
                    ))}
                </div>
            ) : statCards.length > 0 ? (
                <div className="stats-grid">
                    {statCards.map(([key, value], index) => {
                        const Icon = statIcons[index % statIcons.length];
                        return (
                            <article className="stat-card" key={key}>
                                <div className="stat-icon">
                                    <Icon />
                                </div>
                                <span>{formatLabel(key)}</span>
                                <strong>{value}</strong>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No statistics available</h3>
                    <p>The dashboard endpoint responded, but did not include displayable values.</p>
                </div>
            )}
        </section>
    );
}
export default Dashboard;
