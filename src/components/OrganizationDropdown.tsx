import { List } from "@raycast/api";
import { useOrganization, useOrganizations } from "../hooks/useOrganizations";
import { organizationAvatar } from "../switch-organization";

export default function OrganizationDropdown() {
  const [selected, setSelected] = useOrganization();
  const { data, isLoading } = useOrganizations();
  if (!data || data.length < 2) {
    return null;
  }

  const onChange = (id: string) => {
    setSelected(data.find((o) => o.id === id) || null);
  };

  return (
    <List.Dropdown tooltip="Select Organization" value={selected?.id} isLoading={isLoading} onChange={onChange}>
      {data.map((organization) => (
        <List.Dropdown.Item
          key={organization.id}
          title={organization.name}
          value={organization.id}
          icon={organizationAvatar(organization)}
        />
      ))}
    </List.Dropdown>
  );
}
