const express = require("express");
const app = express();
const fs = require('fs');
app.use((req, res, next) => {
    let reqDomain = req.get("host");
    if (reqDomain.indexOf(":") > -1) {
        reqDomain = reqDomain.split(":")[0];
    }
    const domainPath = "public/" + reqDomain.split('.')[0];
    let filePath = domainPath + req.originalUrl;
    console.log(`file path ${filePath}`);
    if (fs.existsSync(domainPath)) {
        filePath = fs.lstatSync(filePath).isDirectory() ? filePath + "/index.html" : filePath;
        console.log(__dirname + "/" + filePath);
        res.sendFile(filePath, { root: __dirname });
    } else {
        res.sendFile('public/not_found.html', { root: __dirname });

    }
});

const port = process.env.PORT || 9201;

app.listen(port, () => console.log("Proxy server is running on port " + port));