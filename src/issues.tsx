import { List } from "@raycast/api";
import IssueItem from "./components/IssueItem";
import { QUERY_UNRESOLVED, useIssues } from "./hooks/useIssues";
import { useOrganization } from "./hooks/useOrganizations";
import ProjectDropdown from "./components/ProjectDropdown";
import { useProject } from "./hooks/useProjects";

export default function Command() {
  const [organization] = useOrganization();
  const [project, setProject] = useProject();

  const { data: issues, isLoading: issuesLoading } = useIssues(organization, QUERY_UNRESOLVED, project);
  const isLoading = !organization || issuesLoading;

  const total = issues?.length === 100 ? "100+" : "" + (issues?.length || 0);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<ProjectDropdown organization={organization} selected={project} onSelect={setProject} />}
    >
      <List.Section title={`Trending · ${total}`}>
        {issues?.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))}
      </List.Section>
    </List>
  );
}
