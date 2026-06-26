import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <div className="Sidebar">
            <h2>BookStore Admin</h2>
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/books">Books</Link>
                </li>
                <li>
                    <Link to="/books/add">Add Book</Link>
                </li>
                <li>
                    <Link to="/books/edit">Edit Books</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>
                        Log Out
                    </button>
                </li>
            </ul>
        </div>
    );
}
export default Sidebar;