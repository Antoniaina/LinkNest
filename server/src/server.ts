import { config } from "dotenv";
config();
import { connectDB } from "./config/db"
import app from "./app";

const PORT = process.env.PORT || 4000;

(async ()=> {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();

