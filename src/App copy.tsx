import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define types for design objects
interface Design {
  id: string;
  filename: string;
  designFlowDoc: string;
  orderIndex: number;
  epicId: string;
  accessUrl: string;
  subFiles: Array<Design>;
  parentFileId?: string; // Optional field for parentFileId
}

// Define drag type
const ITEM_TYPE = "design";

// Array of screen designs you provided
const initialDesigns: Design[] = [
  {
    id: "8ab4aa4e-13b9-486a-a84b-5e7e82347e2e",
    filename:
      "The Account Creation screen allows users to create a GravityWrite account. This screen features the GravityWrite logo, input fields for name, email, and password, a Google sign-up button, and a 'Create Account' button, with options to navigate to the login page or contact support..png",
    designFlowDoc: "",
    orderIndex: 1,
    epicId: "b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac",
    accessUrl:
      "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame 1-2025-03-18T10:30:10.400Z.png",
    subFiles: [],
  },
  {
    id: "f1dbba6e-0858-4d01-a54d-d27a2ad14c1a",
    filename:
      "The Job Role Selection screen asks the user to identify their job role. It includes job role options such as Business Owner, Content Writer, and others, alongside 'Back', 'Next', and 'Skip Survey' buttons, allowing users to define their role or skip the process..png",
    designFlowDoc: "",
    orderIndex: 2,
    epicId: "b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac",
    accessUrl:
      "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame 3-2025-03-18T10:30:10.400Z.png",
    subFiles: [
      {
        id: "88864239-c579-444a-9552-a2c3ff9969d7",
        filename: "This variation of the Job Role Selection screen features 'Content Writer' as the selected job role, demonstrating the ability to choose or adjust preferences within the screen's framework..png",
        designFlowDoc: "",
        orderIndex: 3,
        epicId: "b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac",
        accessUrl: "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame 5-2025-03-18T10:30:10.400Z.png",
        parentFileId: "f1dbba6e-0858-4d01-a54d-d27a2ad14c1a",
        subFiles: []
      },
      {
        id: "23b8f1c0-0e0d-45ff-9cd2-4ce3db808504",
        filename: "An extension of the Job Role Selection screen allowing users to input a custom role. Selecting 'Others' provides an input field to specify a job role not listed among predefined options..png",
        orderIndex: 4,
        accessUrl: "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame 6-2025-03-18T10:30:10.400Z.png",
        parentFileId: "f1dbba6e-0858-4d01-a54d-d27a2ad14c1a",
        designFlowDoc: "",
        epicId: "",
        subFiles: []
      },
    ],
  },
];

// Define the drag-and-drop component for each design
const DesignItem: React.FC<{
  design: Design;
  index: number;
  moveDesign: (dragIndex: number, hoverIndex: number) => void;
  moveSubFileToNewParent: (subFile: Design, newParentId: string) => void;
  moveParentAsSubFile: (parent: Design, newParentId: string) => void;
}> = ({
  design,
  index,
  moveDesign,
  moveSubFileToNewParent,
  moveParentAsSubFile,
}) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveDesign(item.index, index);
        item.index = index;
      }
    },
  });

  const handleMoveSubFileToNewParent = (
    subFile: Design,
    newParentId: string
  ) => {
    moveSubFileToNewParent(subFile, newParentId);
  };

  const handleMoveParentAsSubFile = (parent: Design, newParentId: string) => {
    moveParentAsSubFile(parent, newParentId);
  };

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        margin: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* 4-dot icon */}
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#333",
          marginRight: "10px",
          cursor: "move",
        }}
      ></div>

      {/* Design item details */}
      <img
        src={design.accessUrl}
        alt={design.filename}
        style={{ width: "100px", height: "100px" }}
      />
      <p style={{ marginLeft: "10px", flex: 1 }}>{design.filename}</p>

      {/* Render subFiles if they exist */}
      {design.subFiles && design.subFiles.length > 0 && (
        <div
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            padding: "10px",
            border: "1px dashed #ccc",
            flexDirection: "column",
            display: "flex",
          }}
        >
          {design.subFiles.map((subFile, subIndex) => (
            <DesignItem
              key={subFile.id}
              design={subFile}
              index={subIndex}
              moveDesign={moveDesign}
              moveSubFileToNewParent={moveSubFileToNewParent}
              moveParentAsSubFile={moveParentAsSubFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component to handle the list of designs
const App: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);

  // Function to rearrange designs
  const moveDesign = (dragIndex: number, hoverIndex: number) => {
    const draggedDesign = designs[dragIndex];
    const updatedDesigns = [...designs];
    updatedDesigns.splice(dragIndex, 1);
    updatedDesigns.splice(hoverIndex, 0, draggedDesign);
    setDesigns(updatedDesigns);
  };

  // Move subfile to a new parent
  const moveSubFileToNewParent = (subFile: Design, newParentId: string) => {
    const updatedDesigns = [...designs];

    // Find the parent design of the subfile
    const parentDesign = updatedDesigns.find(
      (d) => d.id === subFile.parentFileId
    );
    if (parentDesign) {
      // Remove the subfile from the current parent's subFiles
      parentDesign.subFiles =
        parentDesign.subFiles?.filter((s) => s.id !== subFile.id) || [];
    }

    // Find the new parent design and add the subfile to its subFiles
    const newParentDesign = updatedDesigns.find((d) => d.id === newParentId);
    if (newParentDesign) {
      subFile.parentFileId = newParentId;
      newParentDesign.subFiles = newParentDesign.subFiles || [];
      newParentDesign.subFiles.push(subFile);
    }

    setDesigns(updatedDesigns);
  };

  // Move parent as a subfile to another parent
  const moveParentAsSubFile = (parent: Design, newParentId: string) => {
    const updatedDesigns = [...designs];

    // Find the new parent design and add the parent as a subfile
    const newParentDesign = updatedDesigns.find((d) => d.id === newParentId);
    if (newParentDesign) {
      parent.parentFileId = newParentId;
      newParentDesign.subFiles = newParentDesign.subFiles || [];
      newParentDesign.subFiles.push(parent);
    }

    // Remove the parent from the main list
    const index = updatedDesigns.findIndex((d) => d.id === parent.id);
    if (index !== -1) {
      updatedDesigns.splice(index, 1);
    }

    setDesigns(updatedDesigns);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Design Flow Screens</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {designs.map((design, index) => (
            <DesignItem
              key={design.id}
              design={design}
              index={index}
              moveDesign={moveDesign}
              moveSubFileToNewParent={moveSubFileToNewParent}
              moveParentAsSubFile={moveParentAsSubFile}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
