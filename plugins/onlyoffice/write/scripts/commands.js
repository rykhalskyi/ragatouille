// import { ExtensionCommand } from './extensionCommand.js';
const ExtensionCommand = window.ExtensionCommand;
// import { Editor } from './ragatouille.js';
const Editor = window.Editor;

// Define InsertContentCommand class extending ExtensionCommand
class InsertContentCommand extends ExtensionCommand {
    constructor() {
        super(
            "insert_content",
            "Insert HTML into document",
            `{ "content" : "string" }`,
            "OnlyOffice DocX Editor",
            ""
        );
    }

    async do(commandArg) {
        try {
            const { content } = commandArg;
            await Editor.callCommand(function() {
                const oDocument = Api.GetDocument();
                const oParagraph = Api.CreateParagraph();
                oParagraph.AddText(content);
                oDocument.InsertContent([oParagraph]);
            });
            return { success: true, message: "Content inserted successfully" };
        } catch (error) {
            console.error("Error inserting content:", error);
            return { success: false, message: error.message };
        }
    }
}

// Define GetContentCommand class extending ExtensionCommand
class GetContentCommand extends ExtensionCommand {
    constructor() {
        super(
            "get_content",
            "Get content from the document in HTML",
            `{}`,
            "OnlyOffice DocX Editor",
            ""
        );
    }

       async do(commandArg) {
        try {           
            return await window.Editor.callCommand(function() {
                const oDocument = Api.GetDocument();
                var allText = oDocument.GetText();
                return { success: true, content: allText };
            });
        } catch (error) {
            console.error("Error getting content:", error);
            return { success: false, message: error.message };
        }
    }
}

class RunCodeCommand extends ExtensionCommand{
    constructor(){
        super(
            "run_code",
            "Runs your office-api code in Only Office runtime. container is:"+  ' + JSON.stringify(code) ' +
                'try {' +
                '  const __result = (function() {' +
                '     + userCode + ' +
                '  })();' +
                '  return { success: true, result: __result === undefined ? null : __result };' +
                '} catch(e) {' +
                '  return { success: false, message: e && e.message ? e.message : String(e) };' +
                '}'+ 'Example of user code: return Api.GetFullName();',
            `{code: "userCode"}`,
            "OnlyOffice DocX Editor",
            ""
        );
    }

    async do(commandArg) {
        try {
            console.log('RUN CODE', commandArg);

            if (typeof commandArg === "string") {
               commandArg = JSON.parse(commandArg);
            }

            const code = commandArg && commandArg.code;
            if (!code) {
                return { success: false, message: "No code provided" };
            }

            // Build a function that will run inside the editor context.
            // We serialize the user code as a string and eval it there, capturing result/errors.
            const func = new Function(
                'try {\n' +
                '  const __result = (function() {\n' +
                '    ' + code + '\n' +
                '  })();\n' +
                '  return { success: true, result: __result === undefined ? null : __result };\n' +
                '} catch(e) {\n' +
                '  return { success: false, message: e && e.message ? e.message : String(e) };\n' +
                '}'
            );

            console.log('RUN CODE FUNC', func);
            const result = await window.Editor.callCommand(func);
            return result;
        } catch (error) {
            console.error("Error running code:", error);
            return { success: false, message: error && error.message ? error.message : String(error) };
        }
    }
}

// Create instances of the commands
const insertContentCmd = new InsertContentCommand();
const getContentCmd = new GetContentCommand();
const runCodeCommand = new RunCodeCommand();

// Make a list and add these commands
const commands = [insertContentCmd, getContentCmd, runCodeCommand];

export function get_commands(entityName){
    for (const item of commands)
    {
        item.entityName = entityName;
        item.app = "OnlyOffice Docx Editor (Word)"
    }

    return commands;
}

export function find_command(commandName)
{
    return commands.find(cmd => cmd.name === commandName);
}