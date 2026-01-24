// Server entry point
import "./config/env.js";
import createApp from "./app.js";
import { connect } from "./config/database.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
    await connect();
    const app = createApp();
    app.get("/", (req, res) => {
        res.send("HealTek Authentication Service is running.");
    });
    const server = app.listen(PORT, "0.0.0.0", () =>
        console.log(`Server listening on http://localhost:${PORT}`)
    );

    server.on("error", (err) => {
        if (err.code === "EACCES") {
        console.error(`Permission denied when trying to bind to port ${PORT}.`);
        console.error("Possible fixes:");
        console.error("- Use a different port: set PORT=8080 before starting.");
        console.error(
            "  In Git Bash: PORT=8080 npm run dev  OR in PowerShell: $env:PORT=8080; npm run dev"
        );
        console.error(
            "- Run the process with elevated privileges (not recommended)."
        );
        console.error("- Make sure no other process is bound to the port:");
        console.error(
            "  Windows: netstat -aon | findstr :3000  then taskkill /PID <pid> /F"
        );
        process.exit(1);
        }
        console.error("Server error:", err);
        process.exit(1);
    });
};

start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});
