// AI Client for multiple providers

import { AIProvider, AIMessage, HAZOP_SYSTEM_PROMPT, HAZOPAnalysisRequest, HAZOPAnalysisResponse, AI_PROVIDERS } from "./providers";

interface AIClientOptions {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export class AIClient {
  private provider: AIProvider;
  private apiKey: string;
  private model: string;
  private baseUrl?: string;

  constructor(options: AIClientOptions) {
    this.provider = options.provider;
    this.apiKey = options.apiKey;
    this.model = options.model || AI_PROVIDERS[options.provider].defaultModel;
    this.baseUrl = options.baseUrl || AI_PROVIDERS[options.provider].baseUrl;
  }

  async chat(messages: AIMessage[]): Promise<string> {
    switch (this.provider) {
      case "OPENAI":
        return this.chatOpenAI(messages);
      case "ANTHROPIC":
        return this.chatAnthropic(messages);
      case "GOOGLE":
        return this.chatGoogle(messages);
      case "OLLAMA":
        return this.chatOllama(messages);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private async chatOpenAI(messages: AIMessage[]): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async chatAnthropic(messages: AIMessage[]): Promise<string> {
    // Extract system message
    const systemMessage = messages.find(m => m.role === "system")?.content || "";
    const userMessages = messages.filter(m => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2000,
        system: systemMessage,
        messages: userMessages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Anthropic API error");
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async chatGoogle(messages: AIMessage[]): Promise<string> {
    // Extract system and convert to Google format
    const systemMessage = messages.find(m => m.role === "system")?.content || "";
    const userMessages = messages.filter(m => m.role !== "system");

    const contents = userMessages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Google API error");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private async chatOllama(messages: AIMessage[]): Promise<string> {
    const baseUrl = this.baseUrl || "http://localhost:11434";

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API error");
    }

    const data = await response.json();
    return data.message.content;
  }

  async analyzeHAZOP(request: HAZOPAnalysisRequest): Promise<HAZOPAnalysisResponse> {
    const userPrompt = `Analyze the following HAZOP deviation:

Node: ${request.nodeName}
${request.nodeDescription ? `Description: ${request.nodeDescription}` : ""}
${request.designIntent ? `Design Intent: ${request.designIntent}` : ""}

Parameter: ${request.parameter}
Guide Word: ${request.guideWord}
Deviation: ${request.guideWord} ${request.parameter}

${request.existingDeviations?.length ? `
Existing deviations for context:
${request.existingDeviations.map(d => `- ${d.guideWord} ${d.parameter}: ${d.cause || "No cause specified"}`).join("\n")}
` : ""}

Provide a comprehensive HAZOP analysis in JSON format.`;

    const messages: AIMessage[] = [
      { role: "system", content: HAZOP_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const response = await this.chat(messages);
    
    // Parse JSON from response
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("No valid JSON found in response");
    } catch {
      // Return a structured error response
      console.error("Failed to parse AI response:", response);
      throw new Error("Failed to parse AI analysis response");
    }
  }
}
