import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { ApiIssue, Assignee, IssueLevel } from "../hooks/useIssues";

type IssueProps = {
  issue: ApiIssue;
};

function issueColor(level: IssueLevel) {
  if (level === "error") {
    return "red";
  } else if (level === "warning") {
    return "rgb(245, 176, 0)";
  } else if (level === "info") {
    return "rgb(60, 116, 221)";
  } else {
    return "gray";
  }
}

function issueIcon(level: IssueLevel) {
  if (level === "error") {
    return Icon.XMarkCircle;
  } else if (level === "warning") {
    return Icon.Warning;
  } else if (level === "info") {
    return Icon.Info;
  } else {
    return Icon.QuestionMarkCircle;
  }
}

function assigneeIcon(assignee: Assignee | null) {
  if (!assignee) {
    return Icon.Circle;
  }
  if (assignee.type === "user") {
    return Icon.PersonCircle;
  } else if (assignee.type === "team") {
    return Icon.TwoPeople;
  } else {
    return Icon.Person;
  }
}

function assignee(assignee: Assignee | null) {
  if (!assignee) {
    return "Unassigned";
  }

  return assignee.type === "team" ? `${assignee.name} (Team)` : assignee.name;
}

function IssueDetails({ issue }: IssueProps) {
  const markdown = `
# ${issue.metadata.type}

in \`${issue.metadata.filename}\`

&nbsp;

> ${issue.metadata.value}
  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={issue.title}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Issue Slug" text={issue.shortId} icon={Icon.CopyClipboard} />
          <Detail.Metadata.Label title="Project" text={issue.project.slug} icon={Icon.Tray} />
          <Detail.Metadata.Label
            title="Assigned To"
            text={assignee(issue.assignedTo)}
            icon={assigneeIcon(issue.assignedTo)}
          />
          <Detail.Metadata.TagList title="Level">
            <Detail.Metadata.TagList.Item
              text={issue.level}
              color={issueColor(issue.level)}
              icon={issueIcon(issue.level)}
            />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link title="Evolution" target="https://www.pokemon.com/us/pokedex/pikachu" text="Raichu" />
        </Detail.Metadata>
      }
    />
  );
}

export default function Issue({ issue }: IssueProps) {
  const accessories = [
    { icon: Icon.Tray, text: issue.project.slug },
    { icon: assigneeIcon(issue.assignedTo), tooltip: assignee(issue.assignedTo) },
  ];

  return (
    <List.Item
      id={issue.id}
      title={issue.title}
      icon={{ source: issueIcon(issue.level), tintColor: issueColor(issue.level) }}
      subtitle={issue.shortId}
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
