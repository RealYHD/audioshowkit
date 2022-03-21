const express = require('express')
const app = express()
const port = 3000

app.use(express.static("pub"));

app.listen(port, () => {
    console.log(`Static express server listening on port ${port}`)
});