using Ragatool.AddIn;
using Ragatool.AddIn.Commands;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace Rumors.Desktop.Common.Commands
{
    internal class AccountDto
    {
        public string name { get; set; }
    }

    internal class GetAllAccountsCommand : IExtensionCommand
    {
        public string Name { get; } = "account_list";
        public string Description { get; } = "Get a list of all accounts";
        public string Input { get; } = "{}";
        public string App { get; } = "Outlook";
        public string Entity { get; set; }

        public Task<string> Do(string arguments)
        {
            var session = Globals.ThisAddIn.Application.Session;
            var accounts = session.Accounts;

            var result = new List<AccountDto>();
            foreach (Microsoft.Office.Interop.Outlook.Account account in accounts)
            {
                result.Add(new AccountDto { name = account.DisplayName });
            }

            var json = JsonSerializer.Serialize(result);
            return Task.FromResult(json);
        }
    }
}
