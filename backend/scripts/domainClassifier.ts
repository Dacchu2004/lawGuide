// scripts/domainClassifier.ts

export type DomainType =
  | "Criminal"
  | "Property"
  | "Cyber"
  | "Family"
  | "Labour"
  | "Constitutional"
  | "Consumer"
  | "Unknown";

// Simple keyword-based classifier (Q1: A)
export function classifyDomain(text: string, act: string): DomainType {
  const t = `${act} ${text}`.toLowerCase();

  // 🔹 Cyber
  if (
    /cyber|computer|electronic record|hacking|data theft|unauthorised access|digital signature|it act/.test(
      t
    )
  ) {
    return "Cyber";
  }

  // 🔹 Family / matrimonial / domestic
  if (
    /marriage|husband|wife|spouse|matrimonial|divorce|dowry|maintenance|custody|domestic violence|family/.test(
      t
    )
  ) {
    return "Family";
  }

  // 🔹 Property / tenancy / land
  if (
    /property|immovable|movable property|transfer of property|landlord|tenant|tenancy|lease|mortgage|title|possession/.test(
      t
    )
  ) {
    return "Property";
  }

  // 🔹 Labour / employment
  if (
    /employment|wages|workman|labour|trade union|industrial dispute|factory|employee|employer/.test(
      t
    )
  ) {
    return "Labour";
  }

  // 🔹 Consumer
  if (
    /consumer|deficiency in service|unfair trade practice|goods|services|compensation/.test(
      t
    )
  ) {
    return "Consumer";
  }

  // 🔹 Constitutional (fundamental rights, state, Constitution)
  if (
    /constitution of india|fundamental rights|directive principles|writ|article \d+/.test(
      t
    )
  ) {
    return "Constitutional";
  }

  // 🔹 Default: most BNS / BNSS / IPC are criminal
  if (
    /bharatiya nyaya sanhita|bharatiya nagarik suraksha sanhita|indian penal code|offence|imprisonment|fine|punishment|cognizable|non-bailable/.test(
      t
    )
  ) {
    return "Criminal";
  }

  return "Unknown";
}
