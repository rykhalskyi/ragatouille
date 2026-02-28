import { ExtensionCommand } from "./extensionCommand.js";

// Define InsertContentCommand class extending ExtensionCommand
class GetAccountListCommand extends ExtensionCommand {
    constructor() {
        super(
            "account_list",
            "Gets list of all accounts",
            `{}`,
            "Mozilla Thunderbird",
            ""
        );
    }

    async do(commandArg) {
        try {
            let accounts = (await messenger.accounts.list()).map(account => ({ id: account.id, name: account.name }));
            return { success: true, message: accounts };
        } catch (error) {
            console.error("Error inserting content:", error);
            return { success: false, message: error.message };
        }
    }
}

const emailQueryInputSchema = {
    "type": "object",
    "properties": {
        "subject": { "type": "string", "description": "Returns only messages with this value matching the subject." },
        "author": { "type": "string", "description": "Returns only messages with this value matching the author. The search value is a single email address, a name or a combination (e.g.: Name <user@domain.org>)." },
        "recipients": { "type": "string", "description": "Returns only messages whose recipients match all specified addresses. The search value is a semicolon separated list of email addresses, names or combinations." },
        "body": { "type": "string", "description": "Returns only messages with this value in the body of the mail." },
        "fullText": { "type": "string", "description": "Returns only messages with this value somewhere in the mail (subject, body or author)." },
        "unread": { "type": "boolean", "description": "Returns only unread (or read if false) messages." },
        "flagged": { "type": "boolean", "description": "Returns only flagged (or unflagged if false) messages." },
        "fromMe": { "type": "boolean", "description": "Returns only messages with the author's address matching any configured identity." },
        "toMe": { "type": "boolean", "description": "Returns only messages with at least one recipient address matching any configured identity." },
        "attachment": { "type": "boolean", "description": "If specified, returns only messages with or without attachments." },
        "fromDate": { "type": "string", "format": "date-time", "description": "Returns only messages with a date after this value (ISO 8601 format)." },
        "toDate": { "type": "string", "format": "date-time", "description": "Returns only messages with a date before this value (ISO 8601 format)." },
        "folderId": { "type": ["string", "array"], "items": { "type": "string" }, "description": "Returns only messages from the specified folder. Use 'list_folders' to get folder IDs." },
        "accountId": { "type": ["string", "array"], "items": { "type": "string" }, "description": "Limits the search to the specified account(s). Use 'account_list' to get account IDs." },
        "includeSubFolders": { "type": "boolean", "description": "Search the folder specified by folderId recursively." },
        "headerMessageId": { "type": "string", "description": "Returns only messages with a Message-ID header matching this value." },
        "tags": { "type": "array", "items": { "type": "string" }, "description": "Returns only messages with all specified tags. Use messenger.messages.listTags() to get available tags." },
        "junkScore": { "type": "object", "description": "Filter by junk score. Supports min/max range.", "properties": { "min": { "type": "number" }, "max": { "type": "number" } } },
        "messagesPerPage": { "type": "integer", "description": "Set the nominal number of messages-per-page for this query. Default is 100." },
        "autoPaginationTimeout": { "type": "integer", "description": "Set the timeout in ms after which results should be returned, even if the nominal number of messages-per-page has not been reached. Default is 1000ms. Set to 0 to disable auto pagination." },
        "returnMessageListId": { "type": "boolean", "description": "If set to true, the return value will include a message list ID for pagination purposes." }
    }
};

class EmailQueryCommand extends ExtensionCommand {
    constructor() {
        super(
            "email_query",
            "Performs a detailed search for messages. Filter by subject, author, date, read status, etc. See input schema for all options.",
            JSON.stringify(emailQueryInputSchema, null, 2),
            "Mozilla Thunderbird",
            ""
        );
    }

    async do(commandArg) {
        try {
           
            const parsedArgs = typeof commandArg === 'string' ? JSON.parse(commandArg) : commandArg;
            const queryInfo = Object.fromEntries(
                Object.entries(parsedArgs).filter(([_, value]) => {
                    if (value === null || value === undefined) return false;
                    if (typeof value === 'string' && value.trim() === '') return false;
                    if (typeof value === 'boolean' && value === false) return false;
                    if (Array.isArray(value) && value.length === 0) return false;
                    return true;
                }).map(([key, value]) => {
                    if (key === 'fromDate' || key === 'toDate') {
                        return [key, new Date(value)];
                    }
                    if (key === 'folderId' && value) {
                        if (Array.isArray(value)) {
                            return [key, value.map(f => typeof f === 'string' ? { accountId: '', path: f } : f)];
                        }
                        return [key, typeof value === 'string' ? { accountId: '', path: value } : value];
                    }
                    return [key, value];
                })
            );

             console.log('query args:', queryInfo);
            let messages = await messenger.messages.query(queryInfo);
            return { success: true, message: messages };
        } catch (error) {
            console.error("Error in email_query:", error);
            return { success: false, message: error.message };
        }
    }
}

const getFullMessagesInputSchema = {
    "type": "object",
    "properties": {
        "messageId": {
            "type": "integer",
            "description": "The unique integer ID representing a MessageHeader and the associated message. This is an internal tracking number that does not remain after a restart, nor does it follow an email that has been moved to a different folder."
        },
        "options": {
            "type": "object",
            "description": "Optional settings for decoding content, headers, and decryption.",
            "properties": {
                "decodeContent": { "type": "boolean", "description": "Whether to decode quoted-printable or base64 encoded content. Defaults to true." },
                "decodeHeaders": { "type": "boolean", "description": "Whether to decode RFC 2047 encoded headers. Defaults to true." },
                "decrypt": { "type": "boolean", "description": "Whether the message should be decrypted. Defaults to true." }
            }
        },
        "full_message":{
            "type": "boolean",
            "description": "Return message with all headers and html body"
        }
    },
    "required": ["messageId"]
};

class GetFullMessage extends ExtensionCommand {
    constructor() {
        super(
            "get_full_message",
            "Returns the specified message, including all headers and MIME parts. Requires a messageId and optionally accepts decoding options.",
            JSON.stringify(getFullMessagesInputSchema, null, 2),
            "Mozilla Thunderbird",
            ""
        );
    }

    async do(commandArg) {
        try {
            console.log('get_full_message args:', commandArg);
            const parsedArgs = typeof commandArg === 'string' ? JSON.parse(commandArg) : commandArg;
            const { messageId, options, full_message } = parsedArgs;
            if (!messageId) {
                throw new Error("messageId is required for GetFullMessagesCommand.");
            }

            let message = await messenger.messages.getFull(messageId, options);
            
            if (full_message === false || full_message === undefined) {
                return { success: true, message: message.parts, apply_filter: "body" };
            }
           
            return { success: true, message: message };
        } catch (error) {
            console.error("Error in get_full_message:", error);
            return { success: false, message: error.message };
        }
    }
}


// Create instances of the commands
const getAccountListCommand = new GetAccountListCommand();
const emailQueryCommand = new EmailQueryCommand();
const getFullMessagesCommand = new GetFullMessage();


// Make a list and add these commands
const commands = [getAccountListCommand, emailQueryCommand, getFullMessagesCommand];

export function get_commands(entity){
    for (const item of commands)
    {
        item.entity = entity;
        item.app = "Mozilla Thunderbird";
    }

    return commands;
}

export function find_command(commandName)
{
    return commands.find(cmd => cmd.name === commandName);
}