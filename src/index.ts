
import express from "express";
import { trouter } from "./twitter";
import { wrouter } from "./wallets";

const app = express();

app.use(express.json());

app.use('/twitter', trouter);

app.use('/wallet', wrouter);

app.post('/bind', (req, res) => {
    console.log('bind: ', req.body);
    res.send("hello world");
})

app.listen(3000, () => {
    console.log(`The main entry point: http://127.0.0.1:3000`);
});
