import {Data} from "@devvit/public-api";

export type MessageFormData = Data & {
    username: string;
    subredditName: string;
    title: string;
    body: string;
    footer: string;
}

export type MessageAppSettings = {
    targetSubreddit: string;
    messageTitle: string;
    messageFooter: string;
}
