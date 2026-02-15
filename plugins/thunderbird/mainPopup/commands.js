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




// Create instances of the commands
const getAccountListCommand = new GetAccountListCommand();


// Make a list and add these commands
const commands = [getAccountListCommand];

export function get_commands(entityName){
    for (const item of commands)
    {
        item.entityName = entityName;
        item.app = "Mozilla Thunderbird";
    }

    return commands;
}

export function find_command(commandName)
{
    return commands.find(cmd => cmd.name === commandName);
}