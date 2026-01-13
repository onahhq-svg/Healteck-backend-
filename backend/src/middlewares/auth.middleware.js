import { verifyAccess } from "../utils/token.js";
import User from "../modules/user/user.model.js";

export default  async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
        }
        const token = auth.split(" ")[1];
        const payload = verifyAccess(token);
        const user = await User.findById(payload.sub).select("-password");
        if (!user) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
        }
        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (err) {
        err.status = err.status || 401;
        next(err);
    }
};
// JWT verification
