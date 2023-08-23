import { Action, ActionPanel, Color, Detail, Icon } from "@raycast/api";
import { ApiIssue } from "../hooks/useIssues";
import { assignee, assigneeIcon, issueColor, issueIcon, substatusColor } from "../utils/issues";

type IssueDetailsProps = {
  issue: ApiIssue;
};

export default function IssueDetails({ issue }: IssueDetailsProps) {
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
          <Detail.Metadata.Label title="Events (1h)" text={issue.count.toString()} icon={Icon.Layers} />
          <Detail.Metadata.Label title="Users (1h)" text={issue.count.toString()} icon={Icon.Person} />

          <Detail.Metadata.Separator />

          <Detail.Metadata.TagList title="">
            <Detail.Metadata.TagList.Item text={issue.substatus} color={substatusColor(issue.substatus)} />
            {issue.isUnhandled ? <Detail.Metadata.TagList.Item text="unhandled" color={Color.Orange} /> : null}
            <Detail.Metadata.TagList.Item
              text={issue.level}
              color={issueColor(issue.level)}
              icon={issueIcon(issue.level)}
            />
          </Detail.Metadata.TagList>

          <Detail.Metadata.Separator />

          <Detail.Metadata.Label
            title="Assigned To"
            text={assignee(issue.assignedTo)}
            icon={assigneeIcon(issue.assignedTo)}
          />
          <Detail.Metadata.Label title="Issue Slug" text={issue.shortId} icon={Icon.CopyClipboard} />
          <Detail.Metadata.Label title="Project" text={issue.project.slug} icon={Icon.Tray} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open in Sentry" url={issue.permalink} />
          <Action.CopyToClipboard title="Copy Permalink" content={issue.permalink} />
        </ActionPanel>
      }
    />
  );
}