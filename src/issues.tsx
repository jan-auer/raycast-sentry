import { List } from "@raycast/api";
import Issue from "./components/Issue";
import OrganizationDropdown from "./components/OrganizationDropdown";
import { useIssues } from "./hooks/useIssues";
import { useOrganization } from "./hooks/useOrganizations";

export default function Command() {
  const [organization, setOrganization] = useOrganization();

  const { data: issues, isLoading: issuesLoading } = useIssues(organization);
  const isLoading = !organization || issuesLoading;

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<OrganizationDropdown selected={organization} onSelect={setOrganization} />}
    >
      {issues?.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </List>
  );
}
