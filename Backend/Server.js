const express=require(`express`)
const mongoose=require(`mongoose`)
require(`dotenv`).config()

const app=express()
const PORT=process.env.PORT || 5000

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log(`Mongoose connected successfully`)
        })
        .catch((error) => {
            console.log(err)
        })

app.listen(PORT,()=>console.log(`App listening on Port: ${PORT}`))

const routes=require("./Routes/Ebook_libraryRoutes");
app.use(routes);
