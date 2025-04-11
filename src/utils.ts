import { Node, MentionRegistry } from "./types";

export function rgbToHex(rgbColor: string): string {
  const defaultColor = "#6366F1";

  if (rgbColor.startsWith("#")) {
    return rgbColor;
  }

  const rgbMatch = rgbColor.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!rgbMatch) {
    return defaultColor;
  }

  try {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return defaultColor;
  }
}

export function toRoman(num: number): string {
  const romanNumerals = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
    "viii",
    "ix",
    "x",
    "xi",
    "xii",
    "xiii",
    "xiv",
    "xv",
    "xvi",
    "xvii",
    "xviii",
    "xix",
    "xx",
  ];
  return num <= 20 ? romanNumerals[num - 1] : `roman-${num}`;
}

export function processClauseNumbering(
  nodes: Node[],
  counterRefs: Record<string, number> = {},
  nestingLevel: number = 0,
  parentId: string = ""
): Node[] {
  return nodes.map((node) => {
    const newNode = { ...node };

    if (node.type === "clause") {
      const nestingStyle = nestingLevel % 3;

      const counterKey = `${parentId}-level-${nestingLevel}`;

      if (!counterRefs[counterKey]) {
        counterRefs[counterKey] = 0;
      }

      counterRefs[counterKey]++;
      const count = counterRefs[counterKey];

      newNode.nestingLevel = nestingLevel;

      if (nestingStyle === 0) {
        newNode.clauseIdentifier = `${count}.`;
      } else if (nestingStyle === 1) {
        // magic string conversion
        const letter = String.fromCharCode(96 + count);
        newNode.clauseIdentifier = `(${letter})`;
      } else {
        const roman = toRoman(count);
        newNode.clauseIdentifier = `${roman})`;
      }

      newNode.id = parentId ? `${parentId}-clause-${count}` : `clause-${count}`;
      newNode.parentId = parentId;
    }

    if (node.children) {
      const newNestingLevel =
        node.type === "clause" ? nestingLevel + 1 : nestingLevel;
      const newParentId =
        node.type === "clause" ? newNode.id || parentId : parentId;

      newNode.children = processClauseNumbering(
        node.children,
        counterRefs,
        newNestingLevel,
        newParentId
      );
    }

    return newNode;
  });
}

export function extractMentionsFromTree(nodes: Node[]): MentionRegistry {
  const mentions: MentionRegistry = {};

  function traverse(node: Node) {
    if (node.type === "mention" && node.id) {
      let textValue = "";
      if (node.children) {
        const extractText = (n: Node): string => {
          if (n.text !== undefined) return n.text;
          if (n.children) return n.children.map(extractText).join("");
          return "";
        };
        textValue = node.children.map(extractText).join("");
      }

      const colorValue = node.color ? rgbToHex(node.color) : "#6366F1";

      mentions[node.id] = {
        value: textValue,
        color: colorValue,
      };
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return mentions;
}
