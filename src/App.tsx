import { useState } from "react";
import "./App.css";
import ContractUploader from "./components/ContractUploader";
import ContractUI from "./components/ContractUI";
import { Node } from "./types";

function App() {
  const [contractData, setContractData] = useState<Node[] | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = (data: Node[], fileName: string) => {
    setContractData(data);
    setFileName(fileName);
  };

  const resetUpload = () => {
    setContractData(null);
    setFileName("");
  };

  return (
    <div className="w-full p-4">
      {!contractData ? (
        <ContractUploader onUpload={handleUpload} />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{fileName}</h1>
            <button
              onClick={resetUpload}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Upload Another Contract
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <ContractUI data={contractData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
