import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the types for the items
enum ItemTypes {
  PARENT = "parent",
  CHILD = "child",
}

// Define the type for a child item
interface ChildItem {
  id: number;
  text: string;
}

// Define the type for a parent item
interface ParentItem {
  id: number;
  children: ChildItem[];
}

// Define the type for the drag item
interface DragItem {
  id: number;
  index: number;
  parentId?: number;
  type: ItemTypes;
}

// Props for the Child component
interface ChildProps {
  id: number;
  text: string;
  index: number;
  moveChild: (
    fromIndex: number,
    toIndex: number,
    fromParentId: number,
    toParentId: number
  ) => void;
  parentId: number;
}

// Props for the Parent component
interface ParentProps {
  id: number;
  children: ChildItem[];
  index: number;
  moveParent: (fromIndex: number, toIndex: number) => void;
  moveChild: (
    fromIndex: number,
    toIndex: number,
    fromParentId: number,
    toParentId: number
  ) => void;
}

// Child component
const Child: React.FC<ChildProps> = ({
  id,
  text,
  index,
  moveChild,
  parentId,
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CHILD,
    item: { id, index, parentId, type: ItemTypes.CHILD },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.CHILD, ItemTypes.PARENT],
    drop: (item: DragItem) => {
      console.log(`Dropped item: ${item.id} (Type: ${item.type})`);
      console.log(`Dropped at Parent: ${parentId}, Child Index: ${index}`);
      if (item.type === ItemTypes.CHILD && item.id !== id) {
        moveChild(item.index, index, item.parentId!, parentId);
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        padding: "8px",
        margin: "4px",
        border: "1px solid black",
        opacity: isDragging ? 0.5 : 1, // Make the child semi-transparent while dragging
        backgroundColor: isDragging ? "lightyellow" : "white", // Change background color when dragging
      }}
    >
      {text}
    </div>
  );
};

// Parent component
const Parent: React.FC<ParentProps> = ({
  id,
  children,
  index,
  moveParent,
  moveChild,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PARENT,
    item: { id, index, type: ItemTypes.PARENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.PARENT, ItemTypes.CHILD],
    drop: (item: DragItem) => {
      console.log(`Dropped item: ${item.id} (Type: ${item.type})`);
      console.log(`Dropped at Parent: ${id}`);
      if (item.type === ItemTypes.PARENT && item.id !== id) {
        moveParent(item.index, index);
      } else if (item.type === ItemTypes.CHILD) {
        // Handle dropping a child into this parent
        moveChild(item.index, 0, item.parentId!, id); // Add to the beginning of the children array
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        padding: "16px",
        margin: "8px",
        border: "2px solid blue",
        opacity: isDragging ? 0.7 : 1, // Make the parent semi-transparent while dragging
        backgroundColor: isDragging ? "lightblue" : "white", // Change background color when dragging
      }}
    >
      <h3>Parent {id}</h3>
      {children.length > 0 ? (
        children.map((child, idx) => (
          <Child
            key={child.id} // Ensure each child has a unique key
            id={child.id}
            text={child.text}
            index={idx}
            moveChild={moveChild}
            parentId={id}
          />
        ))
      ) : (
        <div
          style={{ padding: "8px", margin: "4px", border: "1px dashed gray" }}
        >
          No children
        </div>
      )}
    </div>
  );
};

// App component
const App: React.FC = () => {
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: 1,
      children: [
        { id: 1, text: "Child 1" },
        { id: 2, text: "Child 2" },
      ],
    },
    {
      id: 2,
      children: [
        { id: 3, text: "Child 3" },
        { id: 4, text: "Child 4" },
      ],
    },
    {
      id: 3,
      children: [], // Parent with no children
    },
  ]);

  const moveParent = (fromIndex: number, toIndex: number) => {
    const newParents = [...parents];
    const [movedParent] = newParents.splice(fromIndex, 1);
    newParents.splice(toIndex, 0, movedParent);
    setParents(newParents);
  };

  const moveChild = (
    fromIndex: number,
    toIndex: number,
    fromParentId: number,
    toParentId: number
  ) => {
    const newParents = [...parents];
    const fromParent = newParents.find((parent) => parent.id === fromParentId);
    const toParent = newParents.find((parent) => parent.id === toParentId);

    if (!fromParent || !toParent) {
      console.error("Parent not found");
      return;
    }

    // Ensure the child exists in the fromParent
    if (fromIndex < 0 || fromIndex >= fromParent.children.length) {
      console.error("Invalid fromIndex");
      return;
    }

    // If moving within the same parent
    if (fromParentId === toParentId) {
      const [movedChild] = fromParent.children.splice(fromIndex, 1);
      fromParent.children.splice(toIndex, 0, movedChild);
    } else {
      // Moving between different parents
      const [movedChild] = fromParent.children.splice(fromIndex, 1);
      toParent.children.splice(toIndex, 0, movedChild);
    }

    setParents(newParents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {parents.map((parent, index) => (
          <Parent
            key={parent.id} // Ensure each parent has a unique key
            id={parent.id}
            children={parent.children}
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
