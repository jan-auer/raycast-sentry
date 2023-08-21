import { List } from "@raycast/api";
import { useState } from "react";
import Issue from "./components/Issue";
import OrganizationDropdown from "./components/OrganizationDropdown";
import { Organization } from "./api/base";
import { useIssues } from "./hooks/useIssues";

export default function Command() {
  const [organization, setOrganization] = useState<Organization | null>(null);

  const { data: issues, isLoading: issuesLoading } = useIssues(organization);
  const isLoading = !organization || issuesLoading;

  return (
    <List isLoading={isLoading} searchBarAccessory={<OrganizationDropdown onSelect={setOrganization} />}>
      {issues?.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </List>
  );
}
