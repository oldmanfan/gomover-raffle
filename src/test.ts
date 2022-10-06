import {Client} from "twitter-api-sdk";

const client = new Client("AAAAAAAAAAAAAAAAAAAAAPvXhQEAAAAA5ioIRHUTq%2Bk%2Bq4W64ldYeqoeE%2BI%3DnZWUgOcaspUv5clToODuYvqEoActFehnNy4HHeYattjPkl3rXn");

async function main() {
    // let r = await client.users.findUserById("1139456581869981696", {"user.fields": ["public_metrics"]});
    let r = await client.users.findUserByUsername("NefarioD", {"user.fields": ["public_metrics"]});
    // let r = await client.users.findUserById("1139456581869981696");

    console.log(`findUserById:  ${JSON.stringify(r)}`);
}

main().then().catch(e => console.log)

// const needle  = require("needle");

// const url = 'https://api.twitter.com/2/users/1139456581869981696?user.fields=public_metrics';
// const bearToken = "AAAAAAAAAAAAAAAAAAAAAPvXhQEAAAAA5ioIRHUTq%2Bk%2Bq4W64ldYeqoeE%2BI%3DnZWUgOcaspUv5clToODuYvqEoActFehnNy4HHeYattjPkl3rXn";

// needle.defaults({open_timeout: 60000});

// async function getRequest() {
//     var http = require('http')
// var opt = {
//  host:'127.0.0.1',
//  port:'9999',
//  method:'GET',//这里是发送的方法
//  path:'https://www.google.com',     //这里是访问的路径
// //  headers:{
// //   //这里放期望发送出去的请求头
// //  }
// }
// //以下是接受数据的代码
// var body = '';
// var req = http.request(opt, function(res) {
//   console.log("Got response: " + res.statusCode);
//   res.on('data',function(d){
//   body += d;
//  }).on('end', function(){
//   console.log(res.headers)
//   console.log(body)
//  });

// }).on('error', function(e) {
//   console.log("Got error: " + e.message);
// })
// req.end();
// }

// getRequest().catch(e => console.log(e));