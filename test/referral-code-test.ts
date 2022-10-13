import { ReferralCode } from "../src/twitter/user";

const tip1 = '0x186d3e2402e74cd62a93163f6e520ffb803dd249';
const tip2 = '0x286d3e2402e74cd62a93163f6e520ffb803dd249';

const r1 = ReferralCode(tip1);
const r2 = ReferralCode(tip2);

console.log(`referral code 1: ${r1}`)
console.log(`referral code 2: ${r2}`)
