import { Action, ActionPanel, Clipboard, Icon, List } from "@raycast/api";
import { Project } from "../hooks/useProjects";
import { loadClientKeys } from "../hooks/useClientKeys";
import { Organization } from "../api/base";

type ProjectProps = {
  organization: Organization;
  project: Project;
  onToggleBookmark: () => void;
};

export default function ProjectItem({ organization, project, onToggleBookmark }: ProjectProps) {
  async function copyDsn() {
    const clientKeys = await loadClientKeys(organization, project);
    const dsn = clientKeys?.find((key) => key.isActive)?.dsn?.public;
    if (dsn) {
      await Clipboard.copy(dsn);
    }
  }

  return (
    <List.Item
      id={project.id}
      title={project.slug}
      icon={{ source: project.urls.platform, fallback: Icon.Tray }}
      accessories={project.isBookmarked ? [{ icon: Icon.Star }] : []}
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Open in Browser">
            <Action.OpenInBrowser title="Open Issues" icon={Icon.Tray} url={project.urls.issues} />
            <Action.OpenInBrowser title="Open Details" icon={Icon.Globe} url={project.urls.details} />
            <Action.OpenInBrowser title="Open Alerts" icon={Icon.Bell} url={project.urls.alerts} />
            <Action.OpenInBrowser title="Open Performance" icon={Icon.Bolt} url={project.urls.performance} />
            <Action.OpenInBrowser title="Open Releases" icon={Icon.Layers} url={project.urls.releases} />
          </ActionPanel.Section>
          <ActionPanel.Section title="Settings">
            <Action title="Copy Client Key (DSN)" icon={Icon.Clipboard} onAction={copyDsn} />
            {project.isBookmarked ? (
              <Action title="Unstar Project" icon={Icon.StarDisabled} onAction={onToggleBookmark} />
            ) : (
              <Action title="Star Project" icon={Icon.Star} onAction={onToggleBookmark} />
            )}
            <Action.OpenInBrowser title="Open Settings" icon={Icon.Cog} url={project.urls.settings} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
