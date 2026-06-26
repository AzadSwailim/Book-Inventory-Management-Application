import Sidebar from "../components/Sidebar";
import "./Dashboard.css";
function Dashboard() {
    return(
        <div>
            <Sidebar/>
            <div>
                <h1 className="dashboard">Dashboard</h1>
                <p className="dashboard-content">Welcome</p>
            </div>
        </div>
    );
}
export default Dashboard;