"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Sparkles,
  Save,
  Loader2,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { AI_PROVIDERS, AIProvider } from "@/lib/ai/providers";

interface AISettings {
  id: string;
  provider: string;
  apiKey: string | null;
  model: string | null;
  enabled: boolean;
}

interface AISettingsViewProps {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  aiSettings: AISettings | null;
}

export function AISettingsView({ organization, aiSettings }: AISettingsViewProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    provider: (aiSettings?.provider as AIProvider) || "OPENAI",
    apiKey: "",
    model: aiSettings?.model || "",
    enabled: aiSettings?.enabled || false,
  });

  const currentProvider = AI_PROVIDERS[settings.provider];

  // Update model when provider changes
  useEffect(() => {
    if (!settings.model || !currentProvider.models.includes(settings.model)) {
      setSettings((prev) => ({ ...prev, model: currentProvider.defaultModel }));
    }
  }, [settings.provider, settings.model, currentProvider]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch(`/api/organizations/${organization.id}/ai-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey || undefined, // Only send if changed
          model: settings.model,
          enabled: settings.enabled,
        }),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
        router.refresh();
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus("idle");

    try {
      // Simple test: try to analyze a dummy deviation
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organization.id,
          nodeId: "test",
          parameter: "Flow",
          guideWord: "NO",
        }),
      });

      if (res.ok) {
        setTestStatus("success");
        setTimeout(() => setTestStatus("idle"), 3000);
      } else {
        setTestStatus("error");
      }
    } catch {
      setTestStatus("error");
    } finally {
      setTesting(false);
    }
  };

  const getProviderDocs = (provider: AIProvider): string => {
    switch (provider) {
      case "OPENAI":
        return "https://platform.openai.com/api-keys";
      case "ANTHROPIC":
        return "https://console.anthropic.com/settings/keys";
      case "GOOGLE":
        return "https://aistudio.google.com/app/apikey";
      case "OLLAMA":
        return "https://ollama.ai/download";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/org/${organization.slug}/settings`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to settings
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Configuration</h1>
            <p className="text-muted-foreground">
              Configure AI-powered HAZOP analysis for {organization.name}
            </p>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Choose which AI service to use for HAZOP analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, provider: value as AIProvider }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                    <SelectItem key={key} value={key}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={settings.model}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, model: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentProvider.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Key</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder={
                  aiSettings?.apiKey
                    ? "••••••••••••••••"
                    : settings.provider === "OLLAMA"
                    ? "Not required for local Ollama"
                    : "Enter your API key"
                }
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                }
              />
              {settings.provider !== "OLLAMA" && (
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href={getProviderDocs(settings.provider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {currentProvider.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
              {settings.provider === "OLLAMA" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ollama runs locally on your machine. Make sure Ollama is running and the model is downloaded.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enable AI */}
      <Card>
        <CardHeader>
          <CardTitle>Enable AI Analysis</CardTitle>
          <CardDescription>
            Turn on AI-powered analysis for HAZOP studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Analysis</Label>
              <p className="text-sm text-muted-foreground">
                Allow members to use AI to generate causes, consequences, and recommendations
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {settings.enabled && aiSettings?.apiKey && (
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing}
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : testStatus === "success" ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Connection OK
                </>
              ) : testStatus === "error" ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  Test Failed
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className={saveStatus === "success" ? "bg-green-600 hover:bg-green-600" : ""}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveStatus === "success" ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
