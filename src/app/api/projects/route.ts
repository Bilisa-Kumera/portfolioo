import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

// GET: List all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST: Create a new project
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const project = await Project.create(data);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT: Update a project
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const { _id, ...update } = data;
    const project = await Project.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a project
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { _id } = await req.json();
    await Project.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 