import { Action, ActionPanel, Clipboard, Detail, Icon, List, showHUD } from "@raycast/api";
import { Project, platformUrl } from "../hooks/useProjects";
import { loadPrimaryDsn, useClientKeys } from "../hooks/useClientKeys";
import { Organization } from "../api/base";
import { useIssuesCount } from "../hooks/useIssues";

type ProjectProps = {
  organization: Organization;
  project: Project;
  onToggleBookmark: () => void;
};

function ProjectActions({ organization, project, onToggleBookmark }: ProjectProps) {
  async function copyDsn() {
    const dsn = await loadPrimaryDsn(organization, project);
    if (dsn) {
      await Clipboard.copy(dsn);
      showHUD("Copied DSN to Clipboard");
    }
  }

  async function pasteDsn() {
    const dsn = await loadPrimaryDsn(organization, project);
    if (dsn) {
      await Clipboard.paste(dsn);
    }
  }

  return (
    <>
      <ActionPanel.Section title="Open in Browser">
        <Action.OpenInBrowser title="Open Issues" icon={Icon.Tray} url={project.urls.issues} />
        <Action.OpenInBrowser title="Open Details" icon={Icon.Globe} url={project.urls.details} />
        <Action.OpenInBrowser title="Open Alerts" icon={Icon.Bell} url={project.urls.alerts} />
        <Action.OpenInBrowser title="Open Performance" icon={Icon.Bolt} url={project.urls.performance} />
        <Action.OpenInBrowser title="Open Releases" icon={Icon.Layers} url={project.urls.releases} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Settings">
        <Action
          title="Copy Client Key (DSN)"
          icon={Icon.Clipboard}
          onAction={copyDsn}
          shortcut={{ modifiers: ["cmd"], key: "." }}
        />
        <Action
          title="Paste Client Key (DSN)"
          icon={Icon.Clipboard}
          onAction={pasteDsn}
          shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
        />
        {project.isBookmarked ? (
          <Action title="Unstar Project" icon={Icon.StarDisabled} onAction={onToggleBookmark} />
        ) : (
          <Action title="Star Project" icon={Icon.Star} onAction={onToggleBookmark} />
        )}
        <Action.OpenInBrowser title="Open Settings" icon={Icon.Cog} url={project.urls.settings} />
      </ActionPanel.Section>
    </>
  );
}

function ProjectDetails({ organization, project, onToggleBookmark }: ProjectProps) {
  const { data: clientKeys } = useClientKeys(organization, project);
  const { data: issuesCount } = useIssuesCount(organization, project.id);

  let markdown = `# ${project.slug}`;

  if (issuesCount) {
    markdown += `
| **Issue**     | **Count** (1d) |
| ------------- | ------ |
| Unresolved    | [${issuesCount["is:unresolved"] || 0} ](${project.urls.issues}) |
| Regressed     | [${issuesCount["is:regressed"] || 0} ](${project.urls.issues}) |
| Escalating    | [${issuesCount["is:escalating"] || 0} ](${project.urls.issues}) |
`;
  }

  if (clientKeys && clientKeys.length) {
    markdown += `
## Client Keys (DSNs)

To send data to Sentry you will need to configure an SDK with a client key
(usually referred to as the SENTRY_DSN value):

`;

    for (const key of clientKeys) {
      markdown += `**${key.name}**\n\`\`\`\n${key.dsn.public}\n\`\`\`\n`;
    }
  }

  markdown += `
## Quick Links

 - [Details](${project.urls.details})
 - [Issues](${project.urls.issues})
 - [Alerts](${project.urls.alerts})
 - [Performance](${project.urls.performance})
 - [Releases](${project.urls.releases})
 - [Settings](${project.urls.settings})
  `;

  const otherPlatforms = project.platforms.filter((p) => p != project.platform);
  const platforms = [project.platform, ...otherPlatforms].filter((p) => p !== "");

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Project ID" text={project.id} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.TagList title="Platform">
            {platforms.map((platform) => (
              <Detail.Metadata.TagList.Item
                key={platform}
                text={platform}
                icon={{ source: platformUrl(platform), fallback: Icon.Code }}
              />
            ))}
          </Detail.Metadata.TagList>
          <Detail.Metadata.TagList title="Team Access">
            {project.teams.map((team) => (
              <Detail.Metadata.TagList.Item key={team.id} text={team.slug} icon={Icon.TwoPeople} />
            ))}
          </Detail.Metadata.TagList>
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <ProjectActions organization={organization} project={project} onToggleBookmark={onToggleBookmark} />
        </ActionPanel>
      }
    />
  );
}

export default function ProjectItem({ organization, project, onToggleBookmark }: ProjectProps) {
  return (
    <List.Item
      id={project.id}
      title={project.slug}
      icon={{ source: project.urls.platform, fallback: Icon.Tray }}
      accessories={project.isBookmarked ? [{ icon: Icon.Star }] : []}
      actions={
        <ActionPanel>
          <Action.Push
            title="Show Details"
            target={
              <ProjectDetails organization={organization} project={project} onToggleBookmark={onToggleBookmark} />
            }
          />

          <ProjectActions organization={organization} project={project} onToggleBookmark={onToggleBookmark} />
        </ActionPanel>
      }
    />
  );
}
