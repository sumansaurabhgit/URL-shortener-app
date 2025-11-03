const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const URL = require("./models/url");
const path = require("path");
const { connectMongoDb } = require("./connection");
const { restrictToLoggedinUserOnly,checkAuth} = require("./middleware/auth");
//importing routes file
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectMongoDb("mongodb://127.0.0.1:27017/short-url").
    then(() => console.log('mongodb connected'));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.get("/test", async  (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     });
//     // return res.end(`
//     //     <html>
//     //     <head></head>
//     //     <body>
//     //     <ol>
//     //     ${allUrls.map((url)=>`<li>${url.shortId}-${url.redirectURL}-${url.visitHistory.length}</li>`).join("")}</ol></body>
//     //     `)
// });

app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth,staticRouter);

app.get("/url/:id", async (req, res) => {
    const shortId = req.params.id;

    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    });
    res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=> console.log(`server started at PORT:${PORT}`));

 
