import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import About from '@/models/About';

// GET: Get about information
export async function GET() {
  try {
    await connectDB();
    let about = await About.find().sort({ _id: -1 });

    // If no data exists, create initial data
    if (about.length === 0) {
      const initialData = {
        title: "Your Name",
        subtitle: "Your Profession",
        description: "Your description here...",
        image: "/default-about.jpg"
      };
      about = [await About.create(initialData)];
    }

    return NextResponse.json(about[0]);
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about information' },
      { status: 500 }
    );
  }
}

// POST: Create or update about information
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Update existing or create new
    const about = await About.findOneAndUpdate(
      {},
      data,
      { upsert: true, new: true }
    );
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { error: 'Failed to update about information' },
      { status: 500 }
    );
  }
}

// PUT: Update an about entry
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;
    const about = await About.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error in PUT /api/about:', error);
    return NextResponse.json({ error: 'Failed to update about entry' }, { status: 500 });
  }
}

// DELETE: Delete an about entry
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    await About.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/about:', error);
    return NextResponse.json({ error: 'Failed to delete about entry' }, { status: 500 });
  }
} 