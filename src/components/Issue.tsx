import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { ApiIssue } from "../hooks/useIssues";
import { assignee, assigneeIcon, issueColor, issueIcon } from "../utils/issues";
import IssueDetails from "./IssueDetails";

type IssueProps = {
  issue: ApiIssue;
};

export default function Issue({ issue }: IssueProps) {
  const accessories = [
    issue.isUnhandled ? { tag: { value: "Unhandled", color: Color.Red } } : {},
    { tag: { value: issue.count.toString(), color: Color.SecondaryText }, tooltip: "Events (1h)", icon: Icon.Layers },
    { icon: assigneeIcon(issue.assignedTo), tooltip: assignee(issue.assignedTo) },
  ];

  return (
    <List.Item
      id={issue.id}
      title={issue.title}
      icon={{ source: issueIcon(issue.level), tintColor: issueColor(issue.level) }}
      actions={
        <ActionPanel>
          <Action.Push title="Show Details" target={<IssueDetails issue={issue} />} />
          <Action.OpenInBrowser title="Open in Sentry" url={issue.permalink} />
          <Action.CopyToClipboard title="Copy Permalink" content={issue.permalink} />
          <Action.CopyToClipboard title="Copy Issue ID" content={issue.shortId} />
        </ActionPanel>
      }
      accessories={accessories}
    />
  );
}
