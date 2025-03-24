"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useRef } from "react";

// Helper function for classNames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DesignFileDto = {
  id: string;
  filename: string;
  designFlowDoc: string;
  orderIndex: number;
  accessUrl: string;

  epicId: string;
  parentFileId?: string | null;

  subFiles?: DesignFileDto[];
};

export function DescribeScreens() {
  const designs: DesignFileDto[] = [
    {
      id: "8ab4aa4e-13b9-486a-a84b-5e7e82347e2e",
      filename:
        "The Account Creation screen allows users to create a GravityWrite account. This screen features the GravityWrite logo, input fields for name, email, and password, a Google sign-up button, and a 'Create Account' button, with options to navigate to the login page or contact support..png",
      designFlowDoc: "",
      orderIndex: 1,
      epicId: "b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac",
      accessUrl:
        "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame%201-2025-03-18T10:30:10.400Z.png",
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
        "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame%203-2025-03-18T10:30:10.400Z.png",
      subFiles: [
        {
          id: "88864239-c579-444a-9552-a2c3ff9969d7",
          filename:
            "This variation of the Job Role Selection screen features 'Content Writer' as the selected job role, demonstrating the ability to choose or adjust preferences within the screen's framework..png",
          designFlowDoc: "",
          orderIndex: 3,
          epicId: "b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac",
          accessUrl:
            "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame%205-2025-03-18T10:30:10.400Z.png",
          parentFileId: "f1dbba6e-0858-4d01-a54d-d27a2ad14c1a",
        },
        {
          id: "23b8f1c0-0e0d-45ff-9cd2-4ce3db808504",
          filename:
            "An extension of the Job Role Selection screen allowing users to input a custom role. Selecting 'Others' provides an input field to specify a job role not listed among predefined options..png",
          orderIndex: 4,
          accessUrl:
            "https://d3sqmis56xqhp3.cloudfront.net/Organizations/Organization-579343a4-9e6d-4039-b26d-aff809d6cff0/Project-da96dd3a-c3b1-45cd-9112-514d1aa9a2d5/Epic-b096b57d-2cac-4f1e-8e2f-45b9ef4c42ac/designFiles/Frame%206-2025-03-18T10:30:10.400Z.png",
          parentFileId: "f1dbba6e-0858-4d01-a54d-d27a2ad14c1a",
          designFlowDoc: "",
          epicId: "",
        },
      ],
    },
  ];

  const [designFiles, setDesignFiles] = useState<DesignFileDto[]>(designs);

  useEffect(() => {
    setDesignFiles(designs);
  }, []);

  // Handle the drag and drop functionality with nested files
  const moveItem = (
    draggedItem: DesignFileDto,
    droppedOnItem: DesignFileDto,
    isSubFile: boolean = false
  ) => {
    const updatedDesignFiles = [...designFiles];

    const moveSubFile = (parentFile: DesignFileDto) => {
      if (parentFile.subFiles) {
        const draggedIndex = parentFile.subFiles.findIndex(
          (subfile) => subfile.id === draggedItem.id
        );
        const droppedIndex = parentFile.subFiles.findIndex(
          (subfile) => subfile.id === droppedOnItem.id
        );

        if (draggedIndex > -1 && droppedIndex > -1) {
          // Swap subfiles inside the parent
          const draggedSubFile = parentFile.subFiles[draggedIndex];
          parentFile.subFiles[draggedIndex] = parentFile.subFiles[droppedIndex];
          parentFile.subFiles[droppedIndex] = draggedSubFile;

          setDesignFiles([...updatedDesignFiles]); // Trigger re-render after move
        }
      }
    };

    // Move the file in the main list or subFiles list
    const draggedIndex = updatedDesignFiles.findIndex(
      (file) => file.id === draggedItem.id
    );
    const droppedIndex = updatedDesignFiles.findIndex(
      (file) => file.id === droppedOnItem.id
    );

    if (draggedIndex > -1 && droppedIndex > -1) {
      const draggedFile = updatedDesignFiles[draggedIndex];

      if (!isSubFile) {
        updatedDesignFiles[draggedIndex] = droppedOnItem;
        updatedDesignFiles[droppedIndex] = draggedFile;
      } else {
        moveSubFile(updatedDesignFiles[draggedIndex]); // Handle nested subfile
      }

      setDesignFiles(updatedDesignFiles);
    }
  };

  function DraggableDesignFileItem(props: {
    designFile: DesignFileDto;
    isSubFile?: boolean;
  }) {
    const { designFile, isSubFile } = props;
    const [subFilesCollapsed, setSubFilesCollapsed] = useState<boolean>(true);

    const listRef = useRef<HTMLUListElement | null>(null);

    const [{ isDragging }, drag] = useDrag({
      type: !isSubFile ? "design-file" : "design-sub-file",
      item: designFile,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: "design-file",
      drop: (item: DesignFileDto) => {
        if (item.id !== designFile.id) {
          moveItem(item, designFile, isSubFile);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const handleToggleSubFiles = () =>
      setSubFilesCollapsed((collapsed) => !collapsed);

    return (
      <li
        className="p-4 my-4 border rounded-md"
        ref={(node) => drag(drop(node))}
        style={{
          opacity: isDragging ? 0.4 : 1,
          backgroundColor: isOver ? "#f3f4f6" : "transparent",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="cursor-move">
            <GripVerticalIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-shrink-0">
            <img
              src={designFile.accessUrl}
              alt={`Screen ${designFile.id}`}
              className="object-cover w-48 h-32 rounded-md"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleToggleSubFiles}
                className={`${
                  designFile.subFiles?.length !== 0 ? "" : "invisible"
                }`}
              >
                {subFilesCollapsed ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
              <span className="font-medium">
                Screen {designFile.orderIndex}
              </span>
              <div className="ml-auto">
                <button
                  className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete designFile"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              defaultValue={designFile.filename}
              placeholder="Enter screen description..."
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
            <div className="mt-1 text-sm text-muted-foreground">
              {designFile.filename.length} / 200 characters
            </div>
          </div>
        </div>

        {!isSubFile && (
          <div className="py-2 pl-6 mt-4 ml-auto bg-gray-100 sub-files min-h-8">
            <CollapsiblePrimitive.Collapsible open={subFilesCollapsed}>
              <CollapsiblePrimitive.CollapsibleContent>
                {designFile.subFiles?.map((designSubFile) => (
                  <ul key={designSubFile.id} className="list-none">
                    <DraggableDesignFileItem
                      designFile={designSubFile}
                      isSubFile={true}
                    />
                  </ul>
                ))}
              </CollapsiblePrimitive.CollapsibleContent>
            </CollapsiblePrimitive.Collapsible>
          </div>
        )}
      </li>
    );
  }

  const DraggableDesignFilesArea = ({
    designFiles,
  }: {
    designFiles: DesignFileDto[];
  }) => {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-4">
          {designFiles.map((designFile) => (
            <ul key={designFile.id} className="list-none">
              <DraggableDesignFileItem designFile={designFile} />
            </ul>
          ))}
        </div>
      </DndProvider>
    );
  };

  return (
    <section id="describe-screens">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Describe UI Screens</h1>
          <p className="text-muted-foreground">
            Add descriptions for each screen and drag to reorder them
          </p>
        </div>
        <div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
            <PlusIcon className="w-4 h-4" />
            Add Images
          </button>
        </div>
      </div>

      <div className="my-4">
        <DraggableDesignFilesArea designFiles={designFiles} />
      </div>

      <div className="flex justify-between mt-8">
        <button className="px-4 py-2 border rounded-md">Previous Step</button>
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">
          Next Step
        </button>
      </div>
    </section>
  );
}

export default DescribeScreens;
