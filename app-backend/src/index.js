require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./db/ccsaAcademicDB.js");

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log(error)
        throw error
    })

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB Connection Failed",error);
})