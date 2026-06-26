const prisma = require("../config/prisma");
const getDashboard = async () => {
    const totalBooks = await prisma.book.count();
    const totalStock = await prisma.book.aggregate({
        _sum: {
            stock: true
        }
    });
    const outOfStock = await prisma.book.count({
        where: {
            stock: 0
        }
    });
    const lowStock = await prisma.book.count({
        where: {
            stock: {
                lt: 25
            }
        }
    });
    return{
        totalBooks, 
        totalStock: totalStock._sum.stock || 0,
        outOfStock,
        lowStock
    };
};
module.exports = {
    getDashboard
};