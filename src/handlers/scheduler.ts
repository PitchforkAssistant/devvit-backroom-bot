import {ScheduledJobEvent, TriggerContext} from "@devvit/public-api";

export async function onMailMonitorJob (event: ScheduledJobEvent, context: TriggerContext) {
    console.log(`Running mailMonitorJob\n${JSON.stringify(event)}\n${JSON.stringify(context)}`);
    const unreads = await (await context.reddit.getMessages({type: "unread", pageSize: 100})).all();
    console.log(`Got unreads: ${JSON.stringify(unreads)}`);

    for (const message of unreads) {
        try {
            console.log("Marking as read: ", message);
            console.log(Object.getOwnPropertyNames(message));
            await message.markAsRead(); // As of 0.10.13, this is broken.
            // TODO: Process message, but this will have to wait until message.subject is added.
        } catch (e) {
            console.error("Failed to mark message as read: ", e);
        }
    }
}
