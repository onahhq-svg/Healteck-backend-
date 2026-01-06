// Renamed controller (was home.contoller.js) — placeholder for home endpoints
export const health = (req, res) => {
  res.status(200).json({ status: "ok" });
};

export default { health };
