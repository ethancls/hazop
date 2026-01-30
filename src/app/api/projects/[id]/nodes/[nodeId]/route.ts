import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, nodeId } = await params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, createdById: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const node = await prisma.node.findFirst({
      where: { id: nodeId, projectId },
      include: {
        deviations: {
          include: {
            causes: true,
            consequences: true,
            safeguards: true,
            recommendations: true,
          },
        },
      },
    });

    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json({ node });
  } catch (error) {
    console.error('Get node error:', error);
    return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, nodeId } = await params;
    const data = await request.json();

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, createdById: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const node = await prisma.node.update({
      where: { id: nodeId },
      data: {
        name: data.name,
        description: data.description,
        designIntent: data.designIntent,
        equipment: data.equipment,
        positionX: data.positionX,
        positionY: data.positionY,
      },
    });

    return NextResponse.json({ node });
  } catch (error) {
    console.error('Update node error:', error);
    return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, nodeId } = await params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, createdById: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.node.delete({ where: { id: nodeId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete node error:', error);
    return NextResponse.json({ error: 'Failed to delete node' }, { status: 500 });
  }
}
