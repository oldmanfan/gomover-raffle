import {Client} from "twitter-api-sdk";

const client = new Client("AAAAAAAAAAAAAAAAAAAAAPvXhQEAAAAA5ioIRHUTq%2Bk%2Bq4W64ldYeqoeE%2BI%3DnZWUgOcaspUv5clToODuYvqEoActFehnNy4HHeYattjPkl3rXn");

async function main() {
    // let r = await client.users.findUserById("1139456581869981696", {"user.fields": ["public_metrics"]});
    let r = await client.users.findUserByUsername("NefarioD", {"user.fields": ["public_metrics"]});
    // let r = await client.users.findUserById("1139456581869981696");

    console.log(`findUserById:  ${JSON.stringify(r)}`);
}

main().then().catch(e => console.log)
