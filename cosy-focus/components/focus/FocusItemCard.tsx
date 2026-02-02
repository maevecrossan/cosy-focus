// Card component to display a focus item with title, description and status
"use client";

import { useState } from 'react';
import { FocusItem } from './Column';
import Button from '../ui/Button';

type FocusItemCardProps = {
    item: FocusItem;
    onStart: (id: number) => Promise<void>;
    onComplete: (id: number) => Promise<void>;
};

export default function FocusItemCard({ item, onStart, onComplete }: FocusItemCardProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handler for starting focus
    async function handleStart() {
        try {
            setBusy(true);
            setError(null);
            await onStart(item.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setBusy(false);
        }
    }

    // Handler for completing focus
    async function handleComplete() {
        try {
            setBusy(true);
            setError(null);
            await onComplete(item.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section>
            <div className="mt-3">
                {item.status === "available" && (
                    <button
                        onClick={handleStart}
                        disabled={busy}
                        className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {busy ? "Starting..." : "Start Focus"}
                    </button>
                )}

                {item.status === "in_focus" && (
                    <button
                        onClick={handleComplete}
                        disabled={busy}
                        className="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
                    >
                        {busy ? "Completing..." : "Complete"}
                    </button>
                )}

                {item.status === "completed" && null}

                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
        </section>
    );
}