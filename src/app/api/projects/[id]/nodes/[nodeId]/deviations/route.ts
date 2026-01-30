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

    const deviations = await prisma.deviation.findMany({
      where: { nodeId },
      include: {
        causes: true,
        consequences: true,
        safeguards: true,
        recommendations: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ deviations });
  } catch (error) {
    console.error('Get deviations error:', error);
    return NextResponse.json({ error: 'Failed to fetch deviations' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, nodeId } = await params;
    const { 
      parameter, 
      guideWord, 
      description,
      causes,
      consequences,
      safeguards,
      recommendations,
      severity,
      likelihood,
      riskLevel,
    } = await request.json();

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, createdById: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify node exists
    const node = await prisma.node.findFirst({
      where: { id: nodeId, projectId },
    });

    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    if (!parameter || !guideWord) {
      return NextResponse.json({ error: 'Parameter and guideWord are required' }, { status: 400 });
    }

    const deviation = await prisma.deviation.create({
      data: {
        nodeId,
        createdById: user.id,
        parameter,
        guideWord,
        description: description || '',
        severity,
        likelihood,
        riskLevel,
        status: 'OPEN',
        causes: causes ? {
          create: causes.map((c: { description: string; category: string }) => ({
            description: c.description,
            category: c.category,
          })),
        } : undefined,
        consequences: consequences ? {
          create: consequences.map((c: { description: string; category: string; severity: string }) => ({
            description: c.description,
            category: c.category,
            severity: c.severity,
          })),
        } : undefined,
        safeguards: safeguards ? {
          create: safeguards.map((s: { description: string; type: string; effectiveness: string; existing: boolean }) => ({
            description: s.description,
            type: s.type,
            effectiveness: s.effectiveness,
            existing: s.existing,
          })),
        } : undefined,
        recommendations: recommendations ? {
          create: recommendations.map((r: { description: string; type: string; priority: string }) => ({
            description: r.description,
            type: r.type,
            priority: r.priority,
            status: 'OPEN',
          })),
        } : undefined,
      },
      include: {
        causes: true,
        consequences: true,
        safeguards: true,
        recommendations: true,
      },
    });

    return NextResponse.json({ deviation }, { status: 201 });
  } catch (error) {
    console.error('Create deviation error:', error);
    return NextResponse.json({ error: 'Failed to create deviation' }, { status: 500 });
  }
}
