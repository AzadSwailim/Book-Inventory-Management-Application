import { login } from "../services/auth.services";
import { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import logo from "../assets/as-publications-logo.png";
import "./Login.css";

function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    };

    const formSubmit = async (e) => {
        e.preventDefault();
        const nextErrors = {};

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required";
        }
        if (!formData.password.trim()) {
            nextErrors.password = "Password is required";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            toast.error("Please fill in the required fields");
            return;
        }

        setIsLoading(true);
        try{
            const data = await login(formData);
            localStorage.setItem("token", data.token);
            toast.success("Welcome back");
            navigate("/dashboard");
        }catch (error){
            console.error(error);
            console.log(error.response);
            toast.error("Invalid Email or Password");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="login-page">
            <div className="login-background" aria-hidden="true">
                <span className="login-orbit login-orbit-one" />
                <span className="login-orbit login-orbit-two" />
                <span className="login-grid" />
            </div>

            <main className="login-card" aria-labelledby="login-title">
                <div className="login-brand">
                    <div className="login-mark">
                        <img src={logo} alt="AS Publications" />
                    </div>
                    <div>
                        <span>AS Publications</span>
                        <strong>Book Inventory Management System</strong>
                    </div>
                </div>

                <div className="login-copy">
                    <p className="eyebrow">AS Publications</p>
                    <h1 id="login-title">Welcome back</h1>
                    <p>Manage titles, stock, and covers from a calm private catalog workspace.</p>
                </div>

                <form className="login-form" onSubmit={formSubmit} noValidate>
                    <label className={errors.email ? "login-field has-error" : "login-field"}>
                        <span>Email</span>
                        <div className="login-input-shell">
                            <FiMail />
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && <small>{errors.email}</small>}
                    </label>

                    <label className={errors.password ? "login-field has-error" : "login-field"}>
                        <span>Password</span>
                        <div className="login-input-shell">
                            <FiLock />
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>
                        {errors.password && <small>{errors.password}</small>}
                    </label>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                        <FiArrowRight />
                    </button>
                </form>
            </main>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: "toast-message",
                    duration: 3000
                }}
            />
        </div>
    );
};
export default Login;
