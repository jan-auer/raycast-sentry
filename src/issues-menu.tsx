import { Icon, LaunchType, MenuBarExtra, launchCommand, open } from "@raycast/api";
import { useOrganization, useOrganizations } from "./hooks/useOrganizations";
import { ApiIssue, QUERY_ESCALATING, QUERY_REGRESSED, QUERY_REVIEW, useIssues } from "./hooks/useIssues";
import { issueIcon } from "./utils/issues";

async function launchUserCommand(name: string): Promise<void> {
  return launchCommand({ name, type: LaunchType.UserInitiated });
}

function truncate(input: string, length: number): string {
  if (input.length <= length) {
    return input;
  }

  return input.slice(0, length) + "...";
}

type IssueSectionProps = {
  title: string;
  data: ApiIssue[] | undefined;
  isLoading?: boolean;
};

function IssueSection({ title, data, isLoading }: IssueSectionProps) {
  if (!data && isLoading) {
    return (
      <MenuBarExtra.Section title={title}>
        <MenuBarExtra.Item title="Loading..." />
      </MenuBarExtra.Section>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const more = data.length > 10 ? data.length - 10 : false;
  const truncated = data.slice(0, 10);

  const refreshing = data?.length && isLoading ? " (refreshing...)" : "";

  return (
    <MenuBarExtra.Section title={title + refreshing}>
      {truncated.map((issue) => (
        <MenuBarExtra.Item
          key={issue.id}
          title={truncate(issue.title, 50)}
          icon={issueIcon(issue.level)}
          onAction={() => open(issue.permalink)}
          subtitle={issue.project.slug}
        />
      ))}

      {more && (
        <MenuBarExtra.Item title={`${more} more`} icon={Icon.Ellipsis} onAction={() => launchUserCommand("issues")} />
      )}
    </MenuBarExtra.Section>
  );
}

export default function Command() {
  const { data: organizations } = useOrganizations();
  const [organization, setOrganization] = useOrganization();

  const { data: review, isLoading: reviewLoading } = useIssues(organization, QUERY_REVIEW);
  const { data: regressed, isLoading: regressedLoading } = useIssues(organization, QUERY_REGRESSED);
  const { data: escalating, isLoading: escalatingLoading } = useIssues(organization, QUERY_ESCALATING);

  const total = (review?.length || 0) + (regressed?.length || 0) + (escalating?.length || 0);

  return (
    <MenuBarExtra
      icon={{ source: { light: "favicon.png", dark: "favicon-dark.png" } }}
      tooltip="Sentry Issues"
      title={total.toString()}
    >
      <MenuBarExtra.Item
        title="Search Unresolved Issues"
        shortcut={{ modifiers: ["cmd"], key: "o" }}
        onAction={() => launchUserCommand("issues")}
      />
      <MenuBarExtra.Item
        title="Search Projects"
        shortcut={{ modifiers: ["cmd"], key: "p" }}
        onAction={() => launchUserCommand("projects")}
      />

      <IssueSection title="Regressed" data={regressed} isLoading={!organization || regressedLoading} />
      <IssueSection title="Escalating" data={escalating} isLoading={!organization || escalatingLoading} />
      <IssueSection title="For Review" data={review} isLoading={!organization || reviewLoading} />

      <MenuBarExtra.Section>
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
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
