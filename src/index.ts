
import express from "express";
import { discordRouter } from "./discord";
import { trouter } from "./twitter";
import { walletRouter } from "./wallets/router";

const app = express();

app.use(express.json());

app.use('/twitter', trouter);
app.use('/discord', discordRouter);
app.use('/wallet', walletRouter);
/*
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});
*/

app.post('/bind', (req, res) => {
    console.log('bind: ', req.body);
    res.send("hello world");
})

app.listen(3000, () => {
    console.log(`The main entry point: http://127.0.0.1:3000`);
});
