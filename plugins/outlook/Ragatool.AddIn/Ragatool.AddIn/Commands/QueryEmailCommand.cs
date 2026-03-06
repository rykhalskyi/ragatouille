using Microsoft.Office.Interop.Outlook;
using Ragatool.AddIn.Commands;
using Rumors.Desktop.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace Rumors.Desktop.Common.Commands
{
    internal class QueryEmailArgs
    {
        public string from { get; set; }
        public string to { get; set; }
        public string subject { get; set; }
        public DateTime? datefrom { get; set; }
        public DateTime? datato { get; set; }
        public string body { get; set; }
        public string text { get; set; }
    }

    internal class QueryEmailCommand : IExtensionCommand
    {
        public string Name { get; } = "query_email";
        public string Description { get; } = "Query emails based on search criteria. Search by 'from', 'to', 'subject', 'datefrom', 'datato' uses indexed fields. 'body' and 'text' searches are more expensive.";
        public string Input { get; } = "{\"from\": \"string\", \"to\": \"string\", \"subject\": \"string\", \"datefrom\": \"ISO string\", \"datato\": \"ISO string\", \"body\": \"string\", \"text\": \"string\"}";
        public string App { get; } = "Outlook";
        public string Entity { get; set; }

        public Task<string> Do(string arguments)
        {
            QueryEmailArgs args;
            try
            {
                args = JsonSerializer.Deserialize<QueryEmailArgs>(arguments);
            }
            catch
            {
                args = new QueryEmailArgs();
            }

            var results = new List<MailItemDto>();
            var session = Ragatool.AddIn.Globals.ThisAddIn.Application.Session;
            
            foreach (Account account in session.Accounts)
            {
                try
                {
                    var store = account.DeliveryStore;
                    if (store == null) continue;

                    var inbox = store.GetDefaultFolder(OlDefaultFolders.olFolderInbox);
                    if (inbox == null) continue;

                    var items = inbox.Items;
                    items.Sort("[ReceivedTime]", true);

                    var indexedFilters = new List<string>();

                    if (!string.IsNullOrEmpty(args.from))
                    {
                        // Match sender name or email address using DASL proptags for better reliability
                        indexedFilters.Add($"(\"http://schemas.microsoft.com/mapi/proptag/0x0c1a001f\" LIKE '%{args.from}%' OR \"http://schemas.microsoft.com/mapi/proptag/0x0065001f\" LIKE '%{args.from}%' OR \"urn:schemas:httpmail:fromname\" LIKE '%{args.from}%')");
                    }

                    if (!string.IsNullOrEmpty(args.to))
                    {
                        indexedFilters.Add($"\"urn:schemas:httpmail:to\" LIKE '%{args.to}%'");
                    }

                    if (!string.IsNullOrEmpty(args.subject))
                    {
                        indexedFilters.Add($"\"urn:schemas:httpmail:subject\" LIKE '%{args.subject}%'");
                    }

                    if (args.datefrom.HasValue)
                    {
                        indexedFilters.Add($"\"urn:schemas:httpmail:datereceived\" >= '{args.datefrom.Value.ToString("yyyy-MM-dd HH:mm:ss")}'");
                    }

                    if (args.datato.HasValue)
                    {
                        indexedFilters.Add($"\"urn:schemas:httpmail:datereceived\" <= '{args.datato.Value.ToString("yyyy-MM-dd HH:mm:ss")}'");
                    }

                    Items filteredItems = items;
                    if (indexedFilters.Count > 0)
                    {
                        string filter = "@SQL=" + string.Join(" AND ", indexedFilters);
                        filteredItems = items.Restrict(filter);
                    }

                    int count = 0;
                    foreach (object item in filteredItems)
                    {
                        if (results.Count >= 20) break;
                        if (count >= 100) break; // Limit processing to avoid hangs on large mailboxes

                        if (item is MailItem mail)
                        {
                            bool match = true;

                            // Apply expensive filters (body, text) in code after indexed filters have narrowed down the set
                            if (!string.IsNullOrEmpty(args.body))
                            {
                                if (mail.Body == null || mail.Body.IndexOf(args.body, StringComparison.OrdinalIgnoreCase) < 0)
                                {
                                    match = false;
                                }
                            }

                            if (match && !string.IsNullOrEmpty(args.text))
                            {
                                bool subjectMatch = mail.Subject != null && mail.Subject.IndexOf(args.text, StringComparison.OrdinalIgnoreCase) >= 0;
                                bool bodyMatch = mail.Body != null && mail.Body.IndexOf(args.text, StringComparison.OrdinalIgnoreCase) >= 0;
                                if (!subjectMatch && !bodyMatch)
                                {
                                    match = false;
                                }
                            }

                            if (match)
                            {
                                results.Add(new MailItemDto
                                {
                                    EmailId = mail.EntryID,
                                    From = mail.SenderName + (string.IsNullOrEmpty(mail.SenderEmailAddress) ? "" : $" <{mail.SenderEmailAddress}>"),
                                    CreationTime = mail.CreationTime,
                                    Subject = mail.Subject,
                                    Body = mail.Body != null ? mail.Body.Substring(0, Math.Min(mail.Body.Length, 1000)) : string.Empty,
                                    Person = new PersonDto { Name = mail.SenderName, Email = mail.SenderEmailAddress }
                                });
                            }
                        }
                        count++;
                    }
                }
                catch
                {
                    // Continue with next account if one fails
                }

                if (results.Count >= 20) break;
            }

            var json = JsonSerializer.Serialize(results);
            return Task.FromResult(json);
        }
    }
}
