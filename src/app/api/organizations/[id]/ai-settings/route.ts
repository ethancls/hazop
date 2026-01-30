import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: id,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const aiSettings = await prisma.aISettings.findUnique({
      where: { organizationId: id },
    });

    const maskedSettings = aiSettings ? {
      ...aiSettings,
      apiKey: aiSettings.apiKey 
        ? aiSettings.apiKey.slice(0, 8) + "..." + aiSettings.apiKey.slice(-4)
        : null,
    } : null;

    return NextResponse.json({
      aiSettings: maskedSettings || {
        provider: "OPENAI",
        model: null,
        enabled: false,
        apiKey: null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch AI settings:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { provider, apiKey, model, enabled } = body;

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: id,
          userId: user.id,
        },
      },
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const validProviders = ["OPENAI", "ANTHROPIC", "GOOGLE", "OLLAMA"];
    if (provider && !validProviders.includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const aiSettings = await prisma.aISettings.upsert({
      where: { organizationId: id },
      update: {
        provider: provider || undefined,
        apiKey: apiKey === undefined ? undefined : apiKey,
        model: model === undefined ? undefined : model,
        enabled: enabled === undefined ? undefined : enabled,
      },
      create: {
        organizationId: id,
        provider: provider || "OPENAI",
        apiKey: apiKey || null,
        model: model || null,
        enabled: enabled || false,
      },
    });

    const maskedSettings = {
      ...aiSettings,
      apiKey: aiSettings.apiKey
        ? aiSettings.apiKey.slice(0, 8) + "..." + aiSettings.apiKey.slice(-4)
        : null,
    };

    return NextResponse.json({ aiSettings: maskedSettings });
  } catch (error) {
    console.error("Failed to update AI settings:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
