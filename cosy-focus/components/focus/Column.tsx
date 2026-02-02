// Renders a single column in the focus board
import FocusItemCard from "./FocusItemCard";

type FocusStatus = 'available' | 'in_focus' | 'completed';

export type FocusItem = {
    id: number;
    title: string;
    status: FocusStatus;
}

type ColumnProps = {
    title: string;
    items: FocusItem[];
}

export default function Column({ title, items }: ColumnProps) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">{title}</h3>

            <div className="space-y-2">
                {items.map((item) => (
                    <FocusItemCard key={item.id} item={item} />
                ))}

                {items.length === 0 && (
                    <p className="text-sm opacity-70">No items yet</p>
                )}
            </div>
        </div>
    );
}