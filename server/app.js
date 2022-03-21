const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static("pub"));

app.listen(port, () => {
    console.log(`Static express server listening on port ${port}`)
});