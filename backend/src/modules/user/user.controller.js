import * as userService from "./user.service.js";

export const getMe = async (req, res) => {
    const user = await userService.getById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
};

export const updateMe = async (req, res) => {
    const updated = await userService.updateMe(req.user.id, req.body);
    res.json({ user: updated });
};

export default { getMe, updateMe };
