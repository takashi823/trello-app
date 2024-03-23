import { UniqueIdentifier } from "@dnd-kit/core";

export const Item = ({ id }: { id: UniqueIdentifier }) => {
  return (
    <div className="w-full h-[50px] flex items-center justify-center my-2.5 border bg-white	shadow-md rounded-lg">
      {id}
    </div>
  );
};