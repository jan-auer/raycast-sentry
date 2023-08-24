import IssueSearch from "./components/IssueSearch";
import WithOrganization from "./components/WithOrganization";

export default function Command() {
  return <WithOrganization>{(props) => <IssueSearch {...props} />}</WithOrganization>;
}
