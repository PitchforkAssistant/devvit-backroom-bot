import {Context, Form, FormOnSubmitEvent, SendPrivateMessageOptions} from "@devvit/public-api";
import {isModerator, placeholdersFromRecord, replacePlaceholders} from "devvit-helpers";
import {MessageAppSettings, MessageFormData} from "../types.js";
import {DEFAULTS, ERRORS, HELP_TEXTS, LABELS} from "../constants.js";

export function createMessageForm (data: MessageFormData): Form {
    const placeholders = placeholdersFromRecord({
        "{{sender}}": data.username,
        "{{target}}": data.subredditName,
    });
    return {
        title: replacePlaceholders(LABELS.FORM_TITLE, placeholders),
        description: replacePlaceholders(LABELS.FORM_DESCRIPTION, placeholders),
        fields: [
            {
                type: "string",
                name: "messageTitle",
                label: LABELS.MESSAGE_TITLE,
                helpText: HELP_TEXTS.MESSAGE_TITLE,
                defaultValue: replacePlaceholders(data.title, placeholders),
                disabled: true,
            },
            {
                type: "paragraph",
                name: "messageBody",
                label: LABELS.MESSAGE_BODY,
                helpText: HELP_TEXTS.MESSAGE_BODY,
                placeholder: DEFAULTS.MESSAGE_BODY,
                defaultValue: data.body,
                disabled: false,
                required: true,
                lineHeight: 6,
            },
            {
                type: "paragraph",
                name: "messageFooter",
                label: LABELS.MESSAGE_FOOTER,
                helpText: HELP_TEXTS.MESSAGE_FOOTER,
                defaultValue: replacePlaceholders(data.footer, placeholders),
                disabled: true,
                lineHeight: 3,
            },
        ],
        acceptLabel: LABELS.FORM_ACCEPT,
        cancelLabel: LABELS.FORM_CANCEL,
    };
}

export async function onMessageFormSubmit (event: FormOnSubmitEvent, context: Context) {
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
    if (!await isModerator(context.reddit, user.username, settings.targetSubreddit)) {
        context.ui.showToast(ERRORS.NOT_MODERATOR);
        return;
    }

    console.log(`Sending message to moderators of /r/${settings.targetSubreddit}`);

    const moderators = await context.reddit.getModerators({subredditName: settings.targetSubreddit}).all();
    for (const moderator of moderators) {
        const options: SendPrivateMessageOptions = {
            subject: `${event.values.messageTitle}`,
            text: `${event.values.messageBody}\n\n${event.values.messageFooter}`,
            to: moderator.username,
        };
        await context.reddit.sendPrivateMessage(options);
    }
}
