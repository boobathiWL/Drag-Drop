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
  parents: any;
  moveParentToChild: (fromParentId: number, toParentId: number) => void;
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
  parents: any;
  moveParentToChild: (fromParentId: number, toParentId: number) => void;
}

// Child component
const Child: React.FC<ChildProps> = ({
  id,
  text,
  index,
  moveChild,
  parentId,
  parents,
  moveParentToChild,
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CHILD,
    item: () => {
      console.log("Drag started for child:", { id, index, parentId });
      return { id, index, parentId, type: ItemTypes.CHILD };
    },
    collect: (monitor: { isDragging: () => any }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.CHILD, ItemTypes.PARENT],
    drop: (item: DragItem) => {
      console.log(`Dropped item: ${item.id} (Type: ${item.type})`);
      console.log(`Dropped at Parent: ${parentId}, Child Index: ${index}`);
      console.log(item);

      if (item.type === ItemTypes.CHILD && item.id !== id) {
        moveChild(item.index, index, item.parentId!, parentId);
      }

      if (item.type === ItemTypes.PARENT && item.id !== id) {
        const element = parents.filter((v: { id: number }) => v.id === item.id);
        if (element[0].children.length === 0) {
          moveParentToChild(item.id, parentId);
        }
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
  parents,
  moveParentToChild,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PARENT,
    item: { id, index, type: ItemTypes.PARENT },
    collect: (monitor: { isDragging: () => any; }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.PARENT, ItemTypes.CHILD],
    drop: (item: DragItem, monitor: { getClientOffset: () => any; getSourceClientOffset: () => any; }) => {
      const delta = monitor.getClientOffset();
      const parentRect = monitor.getSourceClientOffset();
      const dropIndex = calculateDropIndex(delta, parentRect);

      console.log(`Dropped item: ${item.id} (Type: ${item.type})`);
      console.log(`Dropped at Parent: ${id}, Child Index: ${dropIndex}`);
      if (item.type === ItemTypes.PARENT && item.id !== id) {
        moveParent(item.index, index);
      } else if (item.type === ItemTypes.CHILD) {
        moveChild(item.index, dropIndex, item.parentId!, id);
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
      {children.length > 0
        ? children.map((child, idx) => (
            <Child
              key={child.id}
              id={child.id}
              text={child.text}
              index={idx}
              moveChild={moveChild}
              parentId={id}
              parents={parents}
              moveParentToChild={moveParentToChild}
            />
          ))
        : ""}
    </div>
  );
};

// Function to calculate the drop index based on the drop position
const calculateDropIndex = (
  clientOffset: { x: number; y: number },
  parentRect: { x: number; y: number }
) => {
  const childHeight = 30; // You can adjust this based on your child element's height
  const offsetY = clientOffset.y - parentRect.y;
  return Math.floor(offsetY / childHeight);
};

// App component
const App: React.FC = () => {
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: 1,
      children: [
        { id: 2, text: "Child 1" },
        { id: 3, text: "Child 2" },
      ],
    },
    {
      id: 4,
      children: [
        { id: 5, text: "Child 3" },
        { id: 6, text: "Child 4" },
      ],
    },
    {
      id: 7,
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
  const moveParentToChild = (fromParentId: number, toParentId: number) => {
    const newParents = [...parents];

    // Find the parent to remove (fromParentId)
    const fromParentIndex = newParents.findIndex(
      (parent) => parent.id === fromParentId
    );
    if (fromParentIndex === -1) return; // If fromParentId doesn't exist, do nothing

    const fromParent: any = newParents.splice(fromParentIndex, 1); // Remove the parent with fromParentId

    fromParent[0].text = "child";
    delete fromParent[0].children;
    // Find the parent to add the children to (toParentId)
    const toParent = newParents.find((parent) => parent.id === toParentId);
    if (!toParent) return; // If toParentId doesn't exist, do nothing

    // Add the children from the removed parent to the target parent
    toParent.children = [...toParent.children, fromParent[0]];
    // Update the state with the modified parents array
    setParents(newParents);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {parents.map((parent, index) => (
          <Parent
            key={parent.id}
            id={parent.id}
            children={parent.children}
            index={index}
            moveParent={moveParent}
            moveChild={moveChild}
            parents={parents}
            moveParentToChild={moveParentToChild}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default App;
