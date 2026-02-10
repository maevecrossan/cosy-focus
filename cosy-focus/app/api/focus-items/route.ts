import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/focus-items - Get all focus items
export async function GET() {
    const items = await prisma.focusItem.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return NextResponse.json(items);
}

// POST /api/focus-items - Create a new focus item
export async function POST(req: Request) {
    // Parse the incoming JSON body
    try {
        const body = await req.json();
        const { title } = body;

        // Basic validation
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return NextResponse.json(
                { error: 'Title is required.' },
                { status: 400 }
            );
        }

        // Create a new focus item in the database
        const newItem = await prisma.focusItem.create({
            data: {
                title: title.trim(),
                status: 'available', // Default status
            },
        })

        // Return the newly created item as JSON
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create a new focus item.' },
            { status: 500 }
        );
    }
}