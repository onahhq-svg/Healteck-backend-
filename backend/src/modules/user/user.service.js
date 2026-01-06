import User from "./user.model.js";
import { hash as hashPassword } from "../../utils/password.js";

export const getById = async (id) => User.findById(id).select("-password");

export const updateMe = async (userId, data) => {
    const up = {};
    if (data.name) up.name = data.name;
    if (data.email) up.email = data.email;
    if (data.password) up.password = await hashPassword(data.password);
    const user = await User.findByIdAndUpdate(userId, up, { new: true }).select(
        "-password"
    );
    return user;
};

export default { getById, updateMe };
