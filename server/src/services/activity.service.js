const prisma = require("../config/prisma");

const logActivity = async ({
    action,
    bookTitle,
    quantity,
    previousStock,
    newStock,
    customerName,
    customerPhone,
    unitPrice,
    totalAmount,
    details
}, prismaClient = prisma) => {
    return await prismaClient.activityLog.create({
        data: {
            action,
            bookTitle,
            quantity,
            previousStock,
            newStock,
            customerName,
            customerPhone,
            unitPrice,
            totalAmount,
            details
        }
    });
};

const getActivities = async (search, action, page, limit, order) => {
    const where = {};

    if (search) {
        where.bookTitle = {
            contains: search,
            mode: "insensitive"
        };
    }

    if (action) {
        where.action = action;
    }

    const [activities, total] = await Promise.all([
        prisma.activityLog.findMany({
            where,
            orderBy: {
                createdAt: order
            },
            skip: (page - 1) * limit,
            take: limit
        }),
        prisma.activityLog.count({ where })
    ]);

    return {
        activities,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit))
    };
};

const deleteActivity = async (id) => {
    const activity = await prisma.activityLog.findUnique({
        where: { id }
    });

    if (!activity) {
        return null;
    }

    return prisma.activityLog.delete({
        where: { id }
    });
};

module.exports = {
    logActivity,
    getActivities,
    deleteActivity
};
