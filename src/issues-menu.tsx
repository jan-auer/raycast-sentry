import { Icon, LaunchType, MenuBarExtra, launchCommand, open } from "@raycast/api";
import { useOrganization, useOrganizations } from "./hooks/useOrganizations";
import { useIssues } from "./hooks/useIssues";
import { issueIcon } from "./components/Issue";

async function launchIssuesCommand(): Promise<void> {
  return launchCommand({ name: "issues", type: LaunchType.UserInitiated });
}

function truncate(input: string, length: number): string {
  if (input.length <= length) {
    return input;
  }

  return input.slice(0, length) + "...";
}

export default function Command() {
  const { data: organizations } = useOrganizations();
  const [organization, setOrganization] = useOrganization();

  const { data: issues, isLoading: issuesLoading } = useIssues(organization);
  const isLoading = !organization || issuesLoading;

  const more = issues && issues.length > 10 ? issues.length - 10 : false;
  const truncated = issues?.slice(0, 10);

  return (
    <MenuBarExtra
      icon={Icon.XMarkCircle}
      isLoading={isLoading}
      tooltip="Unresolved Issues"
      title={issues?.length.toString()}
    >
      <MenuBarExtra.Item
        title="Open Unresolved Issues"
        shortcut={{ modifiers: ["cmd"], key: "o" }}
        onAction={() => launchIssuesCommand()}
      />
      <MenuBarExtra.Submenu title="Switch Organization">
        {organizations?.map((org) => (
          <MenuBarExtra.Item
            key={org.id}
            title={org.name}
            icon={organization?.id == org.id ? Icon.Check : ""}
            onAction={() => setOrganization(org)}
          />
        ))}
      </MenuBarExtra.Submenu>
      {truncated && (
        <MenuBarExtra.Section title="Unresolved Issues">
          {truncated.map((issue) => (
            <MenuBarExtra.Item
              key={issue.id}
              title={truncate(issue.title, 50)}
              icon={issueIcon(issue.level)}
              onAction={() => open(issue.permalink)}
            />
          ))}

          {more && (
            <MenuBarExtra.Item title={`${more} more`} icon={Icon.Ellipsis} onAction={() => launchIssuesCommand()} />
          )}
        </MenuBarExtra.Section>
      )}
    </MenuBarExtra>
  );
}
