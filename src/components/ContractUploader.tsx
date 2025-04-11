import { useState, ChangeEvent } from "react";
import { Node } from "../types";

interface ContractUploaderProps {
  onUpload: (data: Node[], fileName: string) => void;
}

export default function ContractUploader({ onUpload }: ContractUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Please upload a JSON file");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        onUpload(json, file.name);
      } catch {
        setError("Invalid JSON file. Please check the file format.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-md mx-auto text-left">
      <h1 className="text-2xl font-bold mb-4">Contract Parser</h1>
      <p className="mb-4">
        Upload your contract JSON file to parse and display it.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Contract JSON
        </label>
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading && (
        <div className="text-blue-500">Loading your contract...</div>
      )}
    </div>
  );
}
