export type Node = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
  title?: string;
  children?: Node[];
  text?: string;
  color?: string;
  id?: string;
  value?: string;
  clauseNumber?: number;
  clauseIdentifier?: string;
  nestingLevel?: number;
  parentId?: string;
};

export type MentionRegistry = Record<string, { value: string; color: string }>;

export type MentionData = {
  id: string;
  value: string;
  color: string;
};
