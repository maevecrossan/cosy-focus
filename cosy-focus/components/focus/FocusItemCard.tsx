// Card component to display a focus item with title, description and status

import { FocusItem } from './Column';
import Button from '../ui/Button';

type FocusItemCardProps = {
    item: FocusItem;
};

export default function FocusItemCard({ item }: FocusItemCardProps) {
    return (
        <section>
            <div className='rounded-xl border bg-white p-3'>
                
                <p className="font-medium">{item.title}</p>
                <p className="text-xs opacity-60">#{item.id}</p>

                <Button className="mt-2 w-full" variant="primary">
                    Start Focus
                </Button>

                <Button className="mt-2 w-full" variant="secondary">
                    Complete
                </Button>
            </div>
        </section>
    );
}