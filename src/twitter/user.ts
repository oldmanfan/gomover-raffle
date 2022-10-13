import { RewardPoints } from "../rules";
const referralCodeGenerator = require('referral-code-generator')

export type TwitterUser = {
    id: string;
    username: string;
    name: string;
    verified: boolean;
    public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
    }
}

export function CalculateUserPoints(tuser: TwitterUser): number {
    let points = RewardPoints.VERIFY_TWITTER;

    if (tuser.public_metrics.followers_count >= 1000) points += 100;

    if (tuser.verified) points += 10;

    return points;;
}

export function ReferralCode(wallet: string): string {
    return referralCodeGenerator.custom('uppercase', 32, 12, 'temitope');
}

