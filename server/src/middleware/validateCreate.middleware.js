const validateCreate = (req, res, next) => {
    const { title } = req.body;
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    if (!title) {
        return res.status(400).json({
            message: "Title Required"
        });
    }
    if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({
            message: "Invalid Price"
        });
    }
    if (Number.isNaN(stock) || stock < 0) {
        return res.status(400).json({
            message: "Invalid Stock"
        });
    }
    req.body.price = price;
    req.body.stock = stock;
    next();
};
module.exports = validateCreate;