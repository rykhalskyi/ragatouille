const commands = [
    new ExtensionCommand(
        "insert_content",
        "Insert HTLP into document",
        `{ "content" : "string", "position" : "200"  }`,
        "OnlyOffice DocX Editor",
        ""
    ),
    new ExtensionCommand(
        "get_content",
        "Get content from the document in HTML",
        `{}`,
        "OnlyOffice DocX Editor",
        ""
    )
];

export function get_commands(entityName){
    for (const item of commands)
    {
        item.entityName = entityName;
        item.app = "OnlyOffice Docx Editor (Word)"
    }

    return commands;
}
