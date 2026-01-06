export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
        }
        next();
    };
};

export default requireRole;
//RBAC
