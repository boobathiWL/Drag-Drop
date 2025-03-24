import React, { useState } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define types for Parent and Child
interface Child {
  id: string;
  content: string;
}

interface Parent {
  id: string;
  title: string;
  children: Child[];
}

// Initial data
const initialData: Parent[] = [
  {
    id: "parent-1",
    title: "Parent 1",
    children: [
      { id: "child-1", content: "Child 1" },
      { id: "child-2", content: "Child 2" },
    ],
  },
  {
    id: "parent-2",
    title: "Parent 2",
    children: [
      { id: "child-3", content: "Child 3" },
      { id: "child-4", content: "Child 4" },
    ],
  },
];

// Drag item types
const ItemTypes = {
  PARENT: "parent",
  CHILD: "child",
};

// Parent Component
const Parent: React.FC<{
  parent: Parent;
  index: number;
  moveParent: (fromIndex: number, toIndex: number) => void;
  moveChild: (
    fromParentId: string,
    toParentId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}> = ({ parent, index, moveParent, moveChild }) => {
  const [, drop] = useDrop({
    accept: [ItemTypes.PARENT, ItemTypes.CHILD],
    drop(item: any, monitor: DropTargetMonitor) {
      if (item.type === ItemTypes.PARENT) {
        moveParent(item.index, index);
      } else if (item.type === ItemTypes.CHILD) {
        moveChild(item.parentId, parent.id, item.index, parent.children.length);
      }
    },
  });

  const [, drag] = useDrag({
    type: ItemTypes.PARENT,
    item: { type: ItemTypes.PARENT, id: parent.id, index },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ marginBottom: "16px", padding: "8px", border: "1px solid #ccc" }}
    >
      <h3>{parent.title}</h3>
      {parent.children.map((child, childIndex) => (
        <Child
          key={child.id}
          child={child}
          parentId={parent.id}
          index={childIndex}
          moveChild={moveChild}
        />
      ))}
    </div>
  );
};

// Child Component
const Child: React.FC<{
  child: Child;
  parentId: string;
  index: number;
  moveChild: (
    fromParentId: string,
    toParentId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}> = ({ child, parentId, index, moveChild }) => {
  const [, drag] = useDrag({
    type: ItemTypes.CHILD,
    item: { type: ItemTypes.CHILD, id: child.id, parentId, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CHILD,
    hover(item: any, monitor: DropTargetMonitor) {
      if (item.id !== child.id) {
        moveChild(item.parentId, parentId, item.index, index);
        item.index = index;
        item.parentId = parentId;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ padding: "8px", margin: "4px", backgroundColor: "#f4f4f4" }}
    >
      {child.content}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>(initialData);

  const moveParent = (fromIndex: number, toIndex: number) => {
    const updatedParents = [...parents];
    const [movedParent] = updatedParents.splice(fromIndex, 1);
    updatedParents.splice(toIndex, 0, movedParent);
    setParents(updatedParents);
  };

  const moveChild = (
    fromParentId: string,
    toParentId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    const updatedParents = [...parents];
    const fromParentIndex = updatedParents.findIndex(
      (parent) => parent.id === fromParentId
    );
    const toParentIndex = updatedParents.findIndex(
      (parent) => parent.id === toParentId
    );

    const fromParent = updatedParents[fromParentIndex];
    const toParent = updatedParents[toParentIndex];

    const [movedChild] = fromParent.children.splice(fromIndex, 1);
    toParent.children.splice(toIndex, 0, movedChild);

    setParents(updatedParents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {parents.map((parent, index) => (
          <Parent
            key={parent.id}
            parent={parent}
            index={index}
            moveParent={moveParent}
            moveChild={moveChild}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default App;
