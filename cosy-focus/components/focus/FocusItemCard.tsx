// Card component to display a focus item with title, description and status

import { FocusItem } from './Column';

type FocusItemCardProps = {
    item: FocusItem;
};

export default function FocusItemCard( { item }: FocusItemCardProps) {
    return (
        <div className='rounded-xl border bg-white p-3'>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs opacity-60">#{item.id}</p>
        </div>
    );
}