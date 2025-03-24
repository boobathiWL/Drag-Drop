import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

// Initialize GridLayout as a responsive layout
const ResponsiveGridLayout = WidthProvider(Responsive);

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

const App: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>(initialData);

  const handleLayoutChange = (layout: any) => {
    console.log("New Layout", layout);
    // Update your layout state or handle reordering logic here
  };

  return (
    <div style={{ padding: "20px" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: [], // Large screens (e.g., 1200px and above)
          md: [], // Medium screens (e.g., 960px - 1199px)
          sm: [], // Small screens (e.g., 600px - 959px)
          xs: [], // Extra small screens (e.g., 480px - 599px)
          xxs: [], // Extra extra small screens (e.g., 0px - 479px)
        }}
        onLayoutChange={handleLayoutChange}
        cols={{
          lg: 12,
          md: 10,
          sm: 6,
          xs: 4,
          xxs: 2, // Add a value for `xxs` breakpoint
        }}
        rowHeight={30}
        width={1200}
      >
        {parents.map((parent) => (
          <div
            key={parent.id}
            data-grid={{ x: 0, y: 0, w: 4, h: 4 }} // You can customize grid position and size here
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#f4f4f4",
            }}
          >
            <h3>{parent.title}</h3>
            {parent.children.map((child) => (
              <div
                key={child.id}
                style={{
                  padding: "8px",
                  margin: "4px",
                  backgroundColor: "#e0e0e0",
                }}
              >
                {child.content}
              </div>
            ))}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default App;
