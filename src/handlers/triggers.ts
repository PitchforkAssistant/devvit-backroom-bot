import {MenuItemOnPressEvent, Context, OnTriggerEvent, TriggerContext} from "@devvit/public-api";
import {AppInstall, AppUpgrade} from "@devvit/protos";
import {ERRORS} from "../constants.js";
import {cancelExistingJobs, isModerator, startSingletonJob} from "devvit-helpers";
import {MessageAppSettings, MessageFormData} from "../types.js";
import {messageForm} from "../main.js";

export async function onSendItemPressed (event: MenuItemOnPressEvent, context: Context) {
    console.log("onSendItemPressed", event);

    if (!context.userId) {
        context.ui.showToast(ERRORS.NOT_LOGGED_IN);
        console.error("Someone tried to use a moderator-only button without a user ID???", event, context);
        return;
    }

    const settings = await context.settings.getAll<MessageAppSettings>();
    if (!settings.targetSubreddit) {
        context.ui.showToast(ERRORS.NO_TARGET_SUBREDDIT);
        return;
    }

    const user = await context.reddit.getUserById(context.userId);
    if (!await isModerator(context.reddit, settings.targetSubreddit, user.username)) {
        context.ui.showToast(ERRORS.NOT_MODERATOR.replace("{{target}}", settings.targetSubreddit));
        return;
    }

    let thing;
    if (event.location === "post") {
        thing = await context.reddit.getPostById(event.targetId);
    } else if (event.location === "comment") {
        thing = await context.reddit.getCommentById(event.targetId);
    }

    const formData: MessageFormData = {
        username: user.username,
        subredditName: settings.targetSubreddit,
        title: settings.messageTitle,
        body: thing?.permalink || "",
        footer: settings.messageFooter,
    };

    context.ui.showForm(messageForm, formData);
}

export async function onAppChanged (_: OnTriggerEvent<AppInstall | AppUpgrade>, context: TriggerContext) {
    try {
        // const monitorSubredditId = await context.settings.get("monitorSubredditId"); // App scoped setting
        // Disabled for now because PrivateMessage.markAsRead() is broken and it is missing .subject and .reply()
        // if (monitorSubredditId !== context.subredditId) {
        console.log("Not the monitor subreddit, not scheduling mail monitoring job.");
        await cancelExistingJobs(context.scheduler, "mailMonitorJob");
        return;
        // }

        console.log("Scheduling mail monitoring job.");
        await startSingletonJob(context.scheduler, "mailMonitorJob", "* * * * *");
    } catch (e) {
        console.error("Failed to schedule mailMonitorJob job on AppInstall", e);
        throw e;
    }
}

