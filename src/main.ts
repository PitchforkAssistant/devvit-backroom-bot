
import {Devvit, FormFunction, SettingScope} from "@devvit/public-api";
import {DEFAULTS, HELP_TEXTS, LABELS} from "./constants.js";
import {createMessageForm, onMessageFormSubmit} from "./handlers/menus.js";
import {onAppChanged, onSendItemPressed} from "./handlers/triggers.js";
import {onMailMonitorJob} from "./handlers/scheduler.js";
import {validateSubredditName} from "devvit-helpers";

// Enable any Devvit features you might need.
Devvit.configure({
    redditAPI: true,
    redis: true,
});

// Set up the configuration field presented to the user for each installation (subreddit) of the app.
Devvit.addSettings([
    {
        type: "string",
        name: "targetSubreddit",
        label: LABELS.TARGET_SUBREDDIT,
        helpText: HELP_TEXTS.TARGET_SUBREDDIT,
        onValidate: validateSubredditName,
        scope: SettingScope.Installation,
    },
    {
        type: "string",
        name: "messageTitle",
        label: LABELS.MESSAGE_TITLE,
        defaultValue: DEFAULTS.MESSAGE_TITLE,
        scope: SettingScope.App,
    },
    {
        type: "string",
        name: "messageFooter",
        label: LABELS.MESSAGE_FOOTER,
        defaultValue: DEFAULTS.MESSAGE_FOOTER,
        scope: SettingScope.App,
    },
    {
        type: "string",
        name: "monitorSubredditId",
        label: LABELS.MONITOR_SUBREDDIT,
        defaultValue: DEFAULTS.MONITOR_SUBREDDIT,
        scope: SettingScope.App,
    },
]);

Devvit.addMenuItem({
    location: ["post", "comment", "subreddit"],
    label: LABELS.SEND_ITEM,
    forUserType: "moderator",
    onPress: onSendItemPressed,
});

Devvit.addTrigger({
    events: ["AppInstall", "AppUpgrade"],
    onEvent: onAppChanged,
});

Devvit.addSchedulerJob({
    name: "mailMonitorJob",
    onRun: onMailMonitorJob,
});

export const messageForm = Devvit.createForm(createMessageForm as FormFunction, onMessageFormSubmit);

export default Devvit;
