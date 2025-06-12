import { app } from "./app.js"
import connectDb from "./db/index.js"
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

connectDb()
.then( () => {
    app.on("error", (err) => {
        console.log("Express error! -> " + err);
        throw err;
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ->   ${process.env.PORT}`);
    })
})
.catch( (err) => {
    console.log("MongoDb connection failed!!" + err);
})


