import { List } from "@raycast/api";
import { Organization } from "../api/base";
import { useOrganizations } from "../hooks/useOrganizations";

type OrganizationDropdownProps = {
  selected: Organization | null;
  onSelect?: React.Dispatch<React.SetStateAction<Organization | null>>;
};

export default function OrganizationDropdown({ selected, onSelect }: OrganizationDropdownProps) {
  const { data, isLoading } = useOrganizations();
  if (!data || data.length < 2) {
    return null;
  }

  const onChange = (id: string) => {
    onSelect && onSelect(data.find((organization) => organization.id === id) || null);
  };

  return (
    <List.Dropdown tooltip="Select Organization" value={selected?.id} isLoading={isLoading} onChange={onChange}>
      {data.map((organization) => (
        <List.Dropdown.Item
          key={organization.id}
          title={organization.name}
          value={organization.id}
          // TODO: Icon
        />
      ))}
    </List.Dropdown>
  );
}
