const express = require('express')
const app = express()

const { graphqlHTTP } = require("express-graphql");
const cors = require('cors')

require('dotenv').config({ path: './.env' })

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log("Server Running" + " " + process.env.PORT)
})