const authService = require("../services/auth.services");
const getRegister = async (req,res) => {
    const { email, password } = req.body;
    const register = await authService.register(email, password);
    if (!register) {
        return res.status(409).json({
            message: "Conflict"
        });
    }
    return res.status(201).json(register);
};
const getLogin = async (req,res) => {
    const { email, password } = req.body;
    const login = await authService.login(email, password);
    if (!login) {
        return res.status(401).json({
            message: "Invalid Email or Password"
        });
    }
    return res.status(200).json(login);
};
module.exports = {
    getRegister,
    getLogin
};