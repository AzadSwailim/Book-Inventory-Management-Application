const validateUpdate = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    if (req.body.price !== undefined){
        if (Number.isNaN(price) || price < 0) {
            return res.status(400).json({
                message: "Invalid Price"
            });
        }
        req.body.price = price;
    }
    if (req.body.stock !== undefined){
        if (Number.isNaN(stock) || stock < 0) {
            return res.status(400).json({
                message: "Invalid Stock"
            });
        }
        req.body.stock = stock;
    }
    next();
};
module.exports = validateUpdate;