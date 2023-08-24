import { ActionPanel, Color, Detail, Icon } from "@raycast/api";
import { ApiIssue } from "../hooks/useIssues";
import { assignee, assigneeIcon, issueColor, issueIcon, issueType, substatusColor } from "../utils/issues";
import IssueActions from "./IssueActions";

type IssueDetailsProps = {
  issue: ApiIssue;
};

export default function IssueDetails({ issue }: IssueDetailsProps) {
  const markdown = `
# ${issue.metadata.type || issue.title}

> ${issue.metadata.value}

#### Issue Category

${issueType(issue.type)}

${issue.metadata.function ? `#### Function\n\`${issue.metadata.function}\`` : ""}
${issue.metadata.filename ? `#### Location\n${issue.metadata.filename}` : ""}
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
          <IssueActions issue={issue} />
        </ActionPanel>
      }
    />
  );
}
