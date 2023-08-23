import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { useOrganization } from "./hooks/useOrganizations";
import { Project, toggleBookmark, useProjects } from "./hooks/useProjects";
import { Organization } from "./api/base";

type ProjectProps = {
  organization: Organization;
  project: Project;
};

function ProjectDetails({ project }: ProjectProps) {
  const markdown = `
  # ${project.slug}`;

  return <Detail markdown={markdown} />;
}

function Project({ organization, project }: ProjectProps) {
  return (
    <List.Item
      title={project.slug}
      icon={{ source: project.urls.platform }}
      accessories={project.isBookmarked ? [{ icon: Icon.Star }] : []}
      actions={
        <ActionPanel>
          <Action.Push
            title="Show Details"
            target={<ProjectDetails organization={organization} project={project} />}
            icon={Icon.Sidebar}
          />
          <ActionPanel.Section title="Open in Browser">
            <Action.OpenInBrowser title="Open Details" icon={Icon.Globe} url={project.urls.details} />
            <Action.OpenInBrowser title="Open Issues" icon={Icon.Tray} url={project.urls.issues} />
            <Action.OpenInBrowser title="Open Alerts" icon={Icon.Bell} url={project.urls.alerts} />
            <Action.OpenInBrowser title="Open Performance" icon={Icon.Bolt} url={project.urls.performance} />
            <Action.OpenInBrowser title="Open Releases" icon={Icon.Layers} url={project.urls.releases} />
          </ActionPanel.Section>
          <ActionPanel.Section title="Settings">
            <Action.CopyToClipboard title="Copy Client Key (DSN)" content={"TODO"} />
            {project.isBookmarked ? (
              <Action
                title="Unstar Project"
                icon={Icon.StarDisabled}
                onAction={() => toggleBookmark(organization, project)}
              />
            ) : (
              <Action title="Star Project" icon={Icon.Star} onAction={() => toggleBookmark(organization, project)} />
            )}
            <Action.OpenInBrowser title="Open Settings" icon={Icon.Cog} url={project.urls.settings} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const [organization] = useOrganization();
  const { data, isLoading } = useProjects(organization);

  const starred = data?.filter((project) => project.isBookmarked);
  const mine = data?.filter((project) => !project.isBookmarked && project.isMember);
  const other = data?.filter((project) => !project.isBookmarked && !project.isMember);

  return (
    <List isLoading={isLoading}>
      {organization && starred && (
        <List.Section title="Starred">
          {starred.map((project) => (
            <Project key={project.id} organization={organization} project={project} />
          ))}
        </List.Section>
      )}
      {organization && mine && (
        <List.Section title="My Projects">
          {mine.map((project) => (
            <Project key={project.id} organization={organization} project={project} />
          ))}
        </List.Section>
      )}
      {organization && other && (
        <List.Section title="Other">
          {other.map((project) => (
            <Project key={project.id} organization={organization} project={project} />
          ))}
        </List.Section>
      )}
    </List>
  );
}
