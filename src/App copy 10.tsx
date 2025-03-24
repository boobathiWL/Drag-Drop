import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define types for Category and Item
interface Item {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  items: Item[];
}

// Initial data
const initialData: Category[] = [
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
];

// Drag item types
const ItemTypes = {
  CATEGORY: "category",
  ITEM: "item",
};

// Category Component
const Category: React.FC<{
  category: Category;
  index: number;
  moveCategory: (fromIndex: number, toIndex: number) => void;
  moveItem: (
    fromCategoryId: string,
    toCategoryId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}> = ({ category, index, moveCategory, moveItem }) => {
  const [, drop] = useDrop({
    accept: [ItemTypes.CATEGORY, ItemTypes.ITEM],
    drop(item: any) {
      if (item.type === ItemTypes.CATEGORY) {
        moveCategory(item.index, index);
      } else if (item.type === ItemTypes.ITEM) {
        moveItem(
          item.categoryId,
          category.id,
          item.index,
          category.items.length
        );
      }
    },
  });

  const [, drag] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { type: ItemTypes.CATEGORY, id: category.id, index },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="draggable-category">
      <div className="category-container">
        <h2 className="item">{category.name}</h2>
        {category.items.map((item, itemIndex) => (
          <Item
            key={item.id}
            item={item}
            categoryId={category.id}
            index={itemIndex}
            moveItem={moveItem}
          />
        ))}
      </div>
    </div>
  );
};

// Item Component
const Item: React.FC<{
  item: Item;
  categoryId: string;
  index: number;
  moveItem: (
    fromCategoryId: string,
    toCategoryId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}> = ({ item, categoryId, index, moveItem }) => {
  const [, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { type: ItemTypes.ITEM, id: item.id, categoryId, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover(item: any) {
      if (item.id !== item.id) {
        moveItem(item.categoryId, categoryId, item.index, index);
        item.index = index;
        item.categoryId = categoryId;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="draggable">
      <div className="item">{item.name}</div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [categories, setCategories] = useState<Category[]>(initialData);

  const moveCategory = (fromIndex: number, toIndex: number) => {
    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(fromIndex, 1);
    updatedCategories.splice(toIndex, 0, movedCategory);
    setCategories(updatedCategories);
  };

  const moveItem = (
    fromCategoryId: string,
    toCategoryId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    const updatedCategories = [...categories];
    const fromCategoryIndex = updatedCategories.findIndex(
      (category) => category.id === fromCategoryId
    );
    const toCategoryIndex = updatedCategories.findIndex(
      (category) => category.id === toCategoryId
    );

    const fromCategory = updatedCategories[fromCategoryIndex];
    const toCategory = updatedCategories[toCategoryIndex];

    const [movedItem] = fromCategory.items.splice(fromIndex, 1);
    toCategory.items.splice(toIndex, 0, movedItem);

    setCategories(updatedCategories);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {categories.map((category, index) => (
          <Category
            key={category.id}
            category={category}
            index={index}
            moveCategory={moveCategory}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default App;
