module.exports = function (req, res, next) {
    console.log(req.body);
    const { admin, admin_password } = req.body;
    if (!admin || !admin_password)
        return res.status(400).json({ "admin": "You are not allowed to do this operation" });

    if (admin !== "subham301477" || admin_password !== "subham301477@sherlocked")
        return res.status(400).json({ "admin": "You are not allowed to do this operation" });

    next();
}