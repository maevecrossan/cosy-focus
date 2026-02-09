// Next.js API route to unfocus/pause a focus item by its ID

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const idSegment = segments[2];
    const focusItemId = parseInt(idSegment ?? "", 10);

    if (Number.isNaN(focusItemId)) {
        return NextResponse.json(
            { error: "Invalid focus item ID" }, 
            { status: 400 }
        );
    }

    const focusItem = await prisma.focusItem.findUnique({
        where: { id: focusItemId },
    });

    if (!focusItem) {
        return NextResponse.json({ error: "Focus item not found" }, { status: 404 });
    }

    // Only allow unfocusing if the item is currently "in_focus"
    if (focusItem.status !== "in_focus") {
        return NextResponse.json(
            { error: `Cannot unfocus from status: ${focusItem.status}` },
            { status: 409 }
        );
    }

    const updatedItem = await prisma.focusItem.update({
        where: { id: focusItemId },
        data: { status: "available" },
    });

    return NextResponse.json(updatedItem);
}