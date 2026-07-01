import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />}/>
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="books" element={<Books />}/>
          <Route path="books/add" element={<AddBook />}/>
          <Route path="books/edit/:id" element={<EditBook />}/>
          <Route path="activity" element={<ActivityLog />}/>
          <Route path="settings" element={<Settings />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
