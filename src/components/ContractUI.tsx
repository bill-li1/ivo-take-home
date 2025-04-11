import React, { useState, useEffect } from "react";
import { Node, MentionRegistry } from "../types";
import { processClauseNumbering, extractMentionsFromTree } from "../utils";
import NodeRenderer from "./NodeRenderer";
import MentionEditPopover from "./MentionEditPopover";

interface ContractUIProps {
  data: Node[];
}

const ContractUI: React.FC<ContractUIProps> = ({ data }) => {
  const [contractData] = useState<Node[]>(processClauseNumbering(data));
  const [mentionRegistry, setMentionRegistry] = useState<MentionRegistry>({});
  const [selectedMentionId, setSelectedMentionId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize mention registry when data changes
  useEffect(() => {
    setMentionRegistry(extractMentionsFromTree(processClauseNumbering(data)));
  }, [data]);

  const handleMentionClick = (mentionId: string) => {
    if (mentionRegistry[mentionId]) {
      setSelectedMentionId(mentionId);
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedMentionId(null);
  };

  const handleMentionUpdate = (id: string, value: string, color: string) => {
    setMentionRegistry((prev) => ({
      ...prev,
      [id]: { value, color },
    }));
  };

  const selectedMention =
    selectedMentionId && mentionRegistry[selectedMentionId]
      ? { id: selectedMentionId, ...mentionRegistry[selectedMentionId] }
      : null;

  return (
    <div className="contract-document text-left">
      {contractData.map((node, index) => (
        <NodeRenderer
          key={index}
          node={node}
          mentionRegistry={mentionRegistry}
          onMentionClick={handleMentionClick}
        />
      ))}

      <MentionEditPopover
        mention={selectedMention}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleMentionUpdate}
      />
    </div>
  );
};

export default ContractUI;
