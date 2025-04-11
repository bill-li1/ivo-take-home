import React from "react";
import { Node, MentionRegistry } from "../types";

interface NodeRendererProps {
  node: Node;
  mentionRegistry: MentionRegistry;
  onMentionClick: (mentionId: string) => void;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  mentionRegistry,
  onMentionClick,
}) => {
  if (node.text !== undefined) {
    let className = "";
    if (node.bold) className += "font-bold ";
    if (node.italic) className += "italic ";
    if (node.underline) className += "underline ";

    return <span className={className}>{node.text}</span>;
  }

  if (node.type === "mention" && node.id) {
    const mentionData = mentionRegistry[node.id] || {
      value: node.text || "",
      color: node.color || "#6366F1",
    };

    return (
      <span
        className="px-1 py-0.5 rounded text-white cursor-pointer hover:opacity-90"
        style={{ backgroundColor: mentionData.color }}
        onClick={() => onMentionClick(node.id!)}
        title="Click to edit this mention"
        data-mention-id={node.id}
      >
        {mentionData.value}
      </span>
    );
  }

  if (node.type === "clause") {
    return (
      <div className="mt-2 mb-2">
        <div className="flex">
          <div className="mr-2">{node.clauseIdentifier}</div>
          <div className="flex-1">
            {node.children?.map((child, index) => (
              <NodeRenderer
                key={index}
                node={child}
                mentionRegistry={mentionRegistry}
                onMentionClick={onMentionClick}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (node.type === "h1") {
    return (
      <h1 className="text-4xl font-bold text-slate-700 mb-4">
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </h1>
    );
  }

  if (node.type === "h4") {
    return (
      <h4>
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </h4>
    );
  }

  if (node.type === "p") {
    return (
      <p className="mb-3">
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </p>
    );
  }

  if (node.type === "ul") {
    return (
      <ul className="list-disc pl-2 mb-2 mt-2">
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </ul>
    );
  }

  if (node.type === "li") {
    return (
      <li className="mb-1">
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </li>
    );
  }

  if (node.type === "lic") {
    return (
      <>
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </>
    );
  }

  if (node.type === "block") {
    return (
      <div className="mb-4">
        {node.children?.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </div>
    );
  }

  if (node.children) {
    return (
      <>
        {node.children.map((child, index) => (
          <NodeRenderer
            key={index}
            node={child}
            mentionRegistry={mentionRegistry}
            onMentionClick={onMentionClick}
          />
        ))}
      </>
    );
  }

  return null;
};

export default NodeRenderer;
