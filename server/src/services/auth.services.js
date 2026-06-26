const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const register = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (user) {
        return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });
    return {
        id: newUser.id,
        email: newUser.email
    };
};
const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return null;
    }
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, {
        expiresIn: "5h"
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email
        }
    };
};
module.exports = {
    register,
    login
};