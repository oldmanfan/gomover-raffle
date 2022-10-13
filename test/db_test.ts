
import { RaffleDb } from "../src/module";
import { UserProfile } from "../src/module/UserProfile";

async function main() {
    let p: UserProfile = {
        wallet: "0x186d3e2402e74cd62A93163f6e520FFb803DD249",
        type: "evm",
        twitter: "NefarioD",
        discord: "",
        inviteCode: "ABEF87ED9087",
        invitedUser: 0,
        totalPoints: 140
    };

    let raffle = new RaffleDb();
    await raffle.insertUser(p);

    let u = await raffle.selectUser(p.wallet);
    console.log('useres: ', JSON.stringify(u));

    await raffle.addPoints(p.wallet, 30);

    u = await raffle.selectUser(p.wallet);
    console.log('useres2: ', JSON.stringify(u));

    await raffle.inviteSuccess(p.inviteCode, 20);

    u = await raffle.selectUser(p.wallet);
    console.log('useres3: ', JSON.stringify(u));
}

main();