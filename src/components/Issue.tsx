import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { ApiIssue, IssueSubstatus } from "../hooks/useIssues";
import { assignee, assigneeIcon, issueColor, issueIcon, substatusColor } from "../utils/issues";
import IssueDetails from "./IssueDetails";

type IssueProps = {
  issue: ApiIssue;
};

function shouldRender(substatus: IssueSubstatus): boolean {
  return substatus === "regressed" || substatus === "new" || substatus === "escalating";
}

export default function Issue({ issue }: IssueProps) {
  const accessories = [
    shouldRender(issue.substatus) ? { tag: { value: issue.substatus, color: substatusColor(issue.substatus) } } : {},
    issue.isUnhandled ? { tag: { value: "unhandled", color: Color.Orange } } : {},
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
