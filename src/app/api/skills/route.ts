import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
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
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connected, processing request...');
    
    const data = await req.json();
    console.log('Received data:', data);

    // Validate required fields
    const requiredFields = ['name', 'level', 'category', 'image'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate level is between 0 and 100
    if (data.level < 0 || data.level > 100) {
      console.error('Invalid level value:', data.level);
      return NextResponse.json(
        { error: 'Level must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Ensure we're not sending any icon field
    const { icon, ...skillData } = data;

    console.log('Creating new skill...');
    const skill = await Skill.create(skillData);
    console.log('Skill created successfully:', skill);
    
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create skill',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a skill
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { _id, icon, ...update } = data;
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