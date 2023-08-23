import { Color, Icon } from "@raycast/api";
import { Assignee, IssueLevel, IssueSubstatus } from "../hooks/useIssues";

export function issueColor(level: IssueLevel) {
  if (level === "error") {
    return "red";
  } else if (level === "warning") {
    return "rgb(245, 176, 0)";
  } else if (level === "info") {
    return "rgb(60, 116, 221)";
  } else {
    return "gray";
  }
}

export function issueIcon(level: IssueLevel) {
  if (level === "error") {
    return Icon.XMarkCircle;
  } else if (level === "warning") {
    return Icon.Warning;
  } else if (level === "info") {
    return Icon.Info;
  } else {
    return Icon.QuestionMarkCircle;
  }
}

export function assigneeIcon(assignee: Assignee | null) {
  if (!assignee) {
    return Icon.Circle;
  }
  if (assignee.type === "user") {
    return Icon.PersonCircle;
  } else if (assignee.type === "team") {
    return Icon.TwoPeople;
  } else {
    return Icon.Person;
  }
}

export function assignee(assignee: Assignee | null) {
  if (!assignee) {
    return "Unassigned";
  }

  return assignee.type === "team" ? `${assignee.name} (Team)` : assignee.name;
}

export function substatusColor(substatus: IssueSubstatus) {
  if (substatus === "escalating") {
    return Color.Red;
  } else if (substatus === "ongoing") {
    return Color.SecondaryText;
  } else if (substatus === "regressed") {
    return Color.Purple;
  } else if (substatus === "new") {
    return Color.Yellow;
  } else if (substatus === "archived_until_escalating") {
    return Color.SecondaryText;
  } else if (substatus === "archived_until_condition_met") {
    return Color.SecondaryText;
  } else if (substatus === "archived_forever") {
    return Color.SecondaryText;
  }
}
