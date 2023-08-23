import { List } from "@raycast/api";
import Issue from "./components/Issue";
import { useIssues } from "./hooks/useIssues";
import { useOrganization } from "./hooks/useOrganizations";
import ProjectDropdown from "./components/ProjectDropdown";
import { useProject } from "./hooks/useProjects";

export default function Command() {
  const [organization] = useOrganization();
  const [project, setProject] = useProject();

  const { data: issues, isLoading: issuesLoading } = useIssues(organization, project);
  const isLoading = !organization || issuesLoading;

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<ProjectDropdown organization={organization} selected={project} onSelect={setProject} />}
    >
      {issues?.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </List>
  );
}
