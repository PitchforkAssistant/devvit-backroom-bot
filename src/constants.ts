// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

export const LABELS = {
    TARGET_SUBREDDIT: "Target Subreddit",
    SEND_ITEM: "Message All Mods",
    MESSAGE_TITLE: "Message Title",
    MESSAGE_BODY: "Message Body",
    MESSAGE_FOOTER: "Message Footer",
    FORM_TITLE: "Send /r/{{target}}'s Moderators",
    FORM_DESCRIPTION: "Clicking send will send this as a private message to all moderators of /r/{{target}}.",
    FORM_ACCEPT: "Send",
    FORM_CANCEL: "Cancel",
    MONITOR_SUBREDDIT: "Monitor Subreddit",
};

export const HELP_TEXTS = {
    TARGET_SUBREDDIT: "Enter the name of the subreddit whose moderators will be messaged without a prefix. Please note that the sender must be a moderator of both subreddits and the app must be able to see the target subreddit's moderators (i.e. the target subreddit must be public or the app must be an approved member on the target subreddit).",
    SEND_ITEM: "Sends a link to the item to all moderators of the configured target subreddit.",
    MESSAGE_TITLE: "This is a preview of the message title, it cannot be edited.",
    MESSAGE_BODY: "You can edit the message content here.",
    MESSAGE_FOOTER: "This is a preview of the message footer, it cannot be edited.",
};

export const ERRORS = {
    NOT_LOGGED_IN: "You must be logged in to use this feature.",
    NO_TARGET_SUBREDDIT: "You must configure a target subreddit in the app's settings before using this feature.",
    NOT_MODERATOR: "You must be a moderator of /r/{{target}} to mass message its moderators.",
};

export const DEFAULTS = {
    MESSAGE_TITLE: "Message from /u/{{sender}} for /r/{{target}}",
    MESSAGE_BODY: "Write Something Here",
    MESSAGE_FOOTER: "--- \nThis message was sent by a bot on behalf of /u/{{sender}}. Replies are not monitored.",
    MONITOR_SUBREDDIT: "t5_3acsi", // /r/PitchforkAssistant
};

export const OPTIONS = {
};
