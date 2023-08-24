import SwitchOrganization from "../switch-organization";
import { Organization } from "../api/base";
import { useOrganization } from "../hooks/useOrganizations";

export type OrganizationProps = {
  organization: Organization;
  setOrganization: (organization: Organization) => void;
};

type WithOrganizationProps = {
  children: (props: OrganizationProps) => JSX.Element;
};

export default function WithOrganization({ children }: WithOrganizationProps) {
  const [organization, setOrganization] = useOrganization();
  if (organization) {
    return <>{children({ organization, setOrganization })}</>;
  } else {
    return <SwitchOrganization isGuard />;
  }
}
