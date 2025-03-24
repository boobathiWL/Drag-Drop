import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FiAlignJustify } from "react-icons/fi";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";

// Helper function to reorder list items
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Drag item component
const DragItem = ({ id, index, moveItem, children }: any) => {
  const [, drag] = useDrag({
    type: "ITEM",
    item: { id, index },
  });

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        marginBottom: "8px",
      }}
    >
      {/* Flex container for drag handle and children */}
      <div
        className="drag-handle"
        style={{
          marginRight: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "move",
        }}
      >
        <FiAlignJustify style={{ fontSize: "24px", color: "gray" }} />
      </div>
      {/* Children are aligned next to the drag handle */}
      <div className="item-content" style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
};

// Drop area component
const DropArea = ({ id, index, moveItem, children }: any) => {
  const [, drop] = useDrop({
    accept: "ITEM",
    hover: (item: any) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={drop} className="drop-area">
      {children}
    </div>
  );
};

// App component
export default function App() {
  const [categories, setCategories] = useState([
    {
      id: "q101",
      name: "Category 1",
      items: [
        { id: "abc", name: "First" },
        { id: "def", name: "Second" },
      ],
    },
    {
      id: "wkqx",
      name: "Category 2",
      items: [
        { id: "ghi", name: "Third" },
        { id: "jkl", name: "Fourth" },
      ],
    },
  ]);

  const moveItem = (
    startIndex: number,
    endIndex: number,
    categoryId: string
  ) => {
    const categoryIndex = categories.findIndex(
      (category) => category.id === categoryId
    );
    const updatedItems = reorder(
      categories[categoryIndex].items,
      startIndex,
      endIndex
    );

    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items = updatedItems;
    setCategories(updatedCategories);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Hello Nested Drag and Drop</h1>

        <div className="category-container">
          {categories.map((category, categoryIndex) => {
            return (
              <DropArea
                key={category.id}
                id={category.id}
                index={categoryIndex}
                moveItem={moveItem}
              >
                
                <h2>{category.name}</h2>

                <div className="items-list">
                  {category.items.map((item, index) => {
                    return (
                      <DragItem
                        key={item.id}
                        id={item.id}
                        index={index}
                        moveItem={(startIndex: number, endIndex: number) =>
                          moveItem(startIndex, endIndex, category.id)
                        }
                      >
                        <div className="item">{item.name}</div>
                      </DragItem>
                    );
                  })}
                </div>
              </DropArea>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}
