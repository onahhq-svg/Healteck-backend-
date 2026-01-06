import * as authService from "./auth.service.js";
import { validateRegister, validateLogin } from "./auth.validation.js";

export const register = async (req, res) => {
    const payload = validateRegister(req.body);
    const { user, tokens } = await authService.register(payload);
    res.status(201).json({
        user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        },
        tokens,
    });
};

export const login = async (req, res) => {
    const payload = validateLogin(req.body);
    const { user, tokens } = await authService.login(payload);
    res.json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
        tokens,
    });
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ message: "refreshToken required" });
    const tokens = await authService.refresh({ refreshToken });
    res.json(tokens);
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ message: "refreshToken required" });
    await authService.logout({ refreshToken });
    res.status(204).send();
};

export default { register, login, refresh, logout };
