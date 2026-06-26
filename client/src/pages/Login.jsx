import { login } from "../services/auth.services";
import { useState  } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const formSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email.trim()) {
            alert("Enter Email");
            return;
        }
        if (!formData.password.trim()) {
            alert("Enter Password");
            return;
        }
        try{
            const data = await login(formData);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        }catch (error){
            console.error(error);
            console.log(error.response);
            alert("Invalid Email or Password");
        }
    };
    return(
        <div>
            <h1>Login Page</h1>
            <form onSubmit={formSubmit}>
                <input type="email" name="email" placeholder="Enter Email ID" value={formData.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange}/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
export default Login;