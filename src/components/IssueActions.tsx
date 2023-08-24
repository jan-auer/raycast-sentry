import { Action, ActionPanel, Icon } from "@raycast/api";
import { ApiIssue } from "../hooks/useIssues";

type IssueActionsProps = {
  issue: ApiIssue;
};

export default function IssueActions({ issue }: IssueActionsProps) {
  return (
    <>
      <Action.OpenInBrowser title="Open in Sentry" url={issue.permalink} />
      <Action.CopyToClipboard
        title="Copy Permalink"
        content={issue.permalink}
        icon={Icon.Link}
        shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
      />
      <Action.CopyToClipboard
        title="Copy Issue ID"
        content={issue.shortId}
        shortcut={{ modifiers: ["cmd", "shift"], key: "," }}
      />
      <ActionPanel.Section title="Assign to">
        <Action title="Assign to Me" icon={Icon.Person} />
        <Action title="Assign to ..." icon={Icon.AddPerson} />
        <Action title="Clear Assignee" icon={Icon.RemovePerson} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Workflow">
        <Action title="Resolve Issue" icon={Icon.Checkmark} style={Action.Style.Destructive} />
        <Action title="Archive Issue" icon={Icon.List} style={Action.Style.Destructive} />
      </ActionPanel.Section>
    </>
  );
}
