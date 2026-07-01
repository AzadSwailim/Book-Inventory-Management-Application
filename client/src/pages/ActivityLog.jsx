import { useEffect, useMemo, useState } from "react";
import { FiClock, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getActivities } from "../services/activity.services";
import "./ActivityLog.css";

const ACTIVITIES_PER_PAGE = 8;

const actionLabels = {
    BOOK_CREATED: "Book Created",
    BOOK_UPDATED: "Book Updated",
    BOOK_DELETED: "Book Deleted",
    BOOK_SOLD: "Book Sold",
    BOOK_RESTOCKED: "Book Restocked"
};

const formatDate = (value) => {
    return new Date(value).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

const formatTime = (value) => {
    return new Date(value).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
};

const formatRelativeTime = (value) => {
    const activityDate = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) {
        return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    const isToday = activityDate.toDateString() === now.toDateString();
    if (isToday) {
        return `Today ${formatTime(value)}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = activityDate.toDateString() === yesterday.toDateString();
    if (isYesterday) {
        return `Yesterday ${formatTime(value)}`;
    }

    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    return formatDate(value);
};

function ActivityLog() {
    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [order, setOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                const data = await getActivities({
                    search: search.trim(),
                    action,
                    order,
                    page: currentPage,
                    limit: ACTIVITIES_PER_PAGE
                });

                if (isMounted) {
                    setActivities(Array.isArray(data?.activities) ? data.activities : []);
                    setTotalPages(data?.totalPages || 1);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to load activity log");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchActivities();

        return () => {
            isMounted = false;
        };
    }, [search, action, order, currentPage]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

    return (
        <section className="page-section fade-in">
            <div className="section-heading activity-heading">
                <div>
                    <p className="eyebrow">Inventory history</p>
                    <h2>Activity Log</h2>
                </div>
                <p className="section-note">Newest stock movements and book changes.</p>
            </div>

            <div className="activity-filters">
                <label className="activity-search">
                    <span>Book title</span>
                    <div>
                        <FiSearch />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search title"
                        />
                    </div>
                </label>
                <label>
                    <span>Action</span>
                    <select
                        value={action}
                        onChange={(event) => {
                            setAction(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All actions</option>
                        {Object.entries(actionLabels).map(([value, label]) => (
                            <option value={value} key={value}>{label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Sort</span>
                    <select
                        value={order}
                        onChange={(event) => {
                            setOrder(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </label>
            </div>

            {isLoading ? (
                <div className="activity-list">
                    {[1, 2, 3].map((item) => (
                        <article className="activity-card activity-skeleton" key={item}>
                            <span />
                            <strong />
                            <p />
                        </article>
                    ))}
                </div>
            ) : activities.length > 0 ? (
                <>
                    <div className="activity-list">
                        {activities.map((activity) => (
                            <article className="activity-card" key={activity.id}>
                                <div className="activity-card-top">
                                    <span className={`activity-badge ${activity.action?.toLowerCase()}`}>
                                        {actionLabels[activity.action] || activity.action}
                                    </span>
                                    <span className="activity-relative">
                                        <FiClock />
                                        {formatRelativeTime(activity.createdAt)}
                                    </span>
                                </div>

                                <div>
                                    <h3>{activity.bookTitle}</h3>
                                    {activity.details && <p>{activity.details}</p>}
                                </div>

                                <dl className="activity-meta">
                                    {activity.quantity !== null && activity.quantity !== undefined && (
                                        <div>
                                            <dt>Quantity</dt>
                                            <dd>{activity.quantity}</dd>
                                        </div>
                                    )}
                                    {activity.previousStock !== null && activity.previousStock !== undefined && (
                                        <div>
                                            <dt>Previous Stock</dt>
                                            <dd>{activity.previousStock}</dd>
                                        </div>
                                    )}
                                    {activity.newStock !== null && activity.newStock !== undefined && (
                                        <div>
                                            <dt>New Stock</dt>
                                            <dd>{activity.newStock}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt>Date</dt>
                                        <dd>{formatDate(activity.createdAt)}</dd>
                                    </div>
                                    <div>
                                        <dt>Time</dt>
                                        <dd>{formatTime(activity.createdAt)}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>

                    <div className="pagination">
                        <button type="button" className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                            Previous
                        </button>
                        <div className="pagination-pages">
                            {pageNumbers.map((page) => (
                                <button
                                    type="button"
                                    className={page === currentPage ? "pagination-page active" : "pagination-page"}
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <h3>No activity yet</h3>
                    <p>Inventory changes will appear here after books are created, updated, sold, restocked, or deleted.</p>
                </div>
            )}
        </section>
    );
}

export default ActivityLog;
