import mongoose from "mongoose";
import env from "./env.js";

const connect = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    await mongoose.connect(env.mongoURI, {
        // mongoose 6+ no longer needs those options, but keep compatibility
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose.connection;
};

export { connect };
