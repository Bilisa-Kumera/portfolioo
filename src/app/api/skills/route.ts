import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';

// GET: List all skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ _id: -1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST: Create a new skill
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const skill = await Skill.create(data);
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

// PUT: Update a skill
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { _id, ...update } = data;
    const skill = await Skill.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a skill
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    await Skill.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 