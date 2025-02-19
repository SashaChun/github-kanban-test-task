import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskType = {
    id: string;
    title: string;
    opened: string;
    author: string;
    comments: number;
};

export default function Task({ id, title,  opened, author, comments }: TaskType) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : "auto",
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white border-2 sketch-car text-gray-600 border-black p-2 mb-2 rounded-[10px] shadow cursor-grabbing`}
        >
            <p className={' break-words overflow-wrap-break-word text-black line-clamp-2'}>
                {title}
            </p>
            <div className="flex item-row space-x-3">
                <p>{id}</p>
                <p>{opened}</p>
            </div>
            <div className="flex item-row space-x-3">
                <p>{author} |</p>
                <p>comments: {comments}</p>
            </div>
        </div>
    );
}
