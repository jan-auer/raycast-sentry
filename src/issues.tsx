import { List } from "@raycast/api";
import IssueItem from "./components/IssueItem";
import { MAX_ISSUES, QUERY_UNRESOLVED, useIssues } from "./hooks/useIssues";
import ProjectDropdown from "./components/ProjectDropdown";
import { useProject } from "./hooks/useProjects";
import WithOrganization, { OrganizationProps } from "./components/WithOrganization";

function IssuesCommand({ organization }: OrganizationProps) {
  const [project, setProject] = useProject();

  const { data: issues, isLoading } = useIssues(organization, QUERY_UNRESOLVED, project);
  const count = issues?.length || 0;
  const total = count == MAX_ISSUES ? MAX_ISSUES + "+" : count;

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

export default function Command() {
  return <WithOrganization>{(props) => <IssuesCommand {...props} />}</WithOrganization>;
}
