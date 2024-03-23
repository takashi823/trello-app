"use client";

import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const SortableContainer = ({
  id,
  items,
  label,
}: {
  id: string;
  items: string[];
  label: string;
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className="w-full min-h-full m-6 bg-gray-200 p-5 rounded-md shadow-md"
      >
        <p className="text-md font-bold text-sky-950">{label}</p>
        {items.map((id: string) => (
          <SortableItem key={id} id={id} />
        ))}
      </div>
    </SortableContext>
  );
};

export default SortableContainer;
