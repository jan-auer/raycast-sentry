import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { ApiIssue, IssueSubstatus } from "../hooks/useIssues";
import { assignee, assigneeIcon, issueColor, issueIcon, substatusColor } from "../utils/issues";
import IssueDetails from "./IssueDetails";
import { platformUrl } from "../hooks/useProjects";
import IssueActions from "./IssueActions";

type IssueProps = {
  issue: ApiIssue;
  showProject?: boolean;
};

function shouldRender(substatus: IssueSubstatus): boolean {
  return substatus === "regressed" || substatus === "new" || substatus === "escalating";
}

export default function IssueItem({ issue, showProject }: IssueProps) {
  const accessories = [
    // Substatus
    shouldRender(issue.substatus) ? { tag: { value: issue.substatus, color: substatusColor(issue.substatus) } } : {},

    // Unhandled
    issue.isUnhandled ? { tag: { value: "unhandled", color: Color.Orange } } : {},

    // Event count
    { tag: { value: issue.count.toString(), color: Color.SecondaryText }, tooltip: "Events (1h)", icon: Icon.Layers },

    // ProjectIcon
    showProject
      ? { icon: { source: platformUrl(issue.project.platform), fallback: Icon.Tray }, tooltip: issue.project.slug }
      : {},

    // Assignee
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
          <IssueActions issue={issue} />
        </ActionPanel>
      }
      accessories={accessories}
    />
  );
}
