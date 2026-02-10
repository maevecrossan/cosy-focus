// Renders a single column in the focus board
import FocusItemCard from "./FocusItemCard";

type FocusStatus = 'available' | 'in_focus' | 'completed' | 'unfocused';

export type FocusItem = {
    id: number;
    title: string;
    status: FocusStatus;
}

type ColumnProps = {
    title: string;
    items: FocusItem[];
    onStart: (id: number) => Promise<void>;
    onComplete: (id: number) => Promise<void>;
    onUnfocus?: (id: number) => Promise<void>;
}

export default function Column({ title, items, onStart, onComplete, onUnfocus }: ColumnProps) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">{title}</h3>

            {/* Button to add new focus item */}
            {title === 'Available' && (
                <button className="mb-3 w-full rounded-lg bg-blue-500 py-2 px-4 text-white hover:bg-blue-600">
                    Add Item
                </button>
            )}

            <div className="space-y-2">
                {items.map((item) => (
                    <FocusItemCard 
                        key={item.id} 
                        item={item} 
                        onStart={onStart} 
                        onComplete={onComplete} 
                        onUnfocus={onUnfocus} />
                ))}

                {items.length === 0 && (
                    <p className="text-sm opacity-70">No items yet</p>
                )}
            </div>
        </div>
    );
}