"use server";

import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";
import type { AIConversation, AIMessage } from "./ai-assistant.types";

export type AIActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; authExpired: boolean };

function failed<T>(error: string): AIActionResult<T> {
  return {
    success: false,
    error,
    authExpired: /invalid or expired token|не авторизован/i.test(error),
  };
}

async function authToken(): Promise<AIActionResult<string>> {
  const value = await getToken();
  return value ? { success: true, data: value } : failed("Не авторизован");
}

function mapConversation(row: Record<string, unknown>): AIConversation {
  const client = row.client as Record<string, unknown> | null;
  return {
    id: row.id as string,
    title: row.title as string,
    contextType: row.context_type as AIConversation["contextType"],
    status: row.status as AIConversation["status"],
    client: client ? { id: client.id as string, name: client.full_name as string } : null,
    lastMessagePreview: (row.last_message_preview as string) ?? null,
    lastMessageAt: (row.last_message_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapMessage(row: Record<string, unknown>): AIMessage {
  return {
    id: row.id as string,
    conversationId: row.conversation_id as string,
    role: row.role as AIMessage["role"],
    content: row.content as string,
    status: row.status as AIMessage["status"],
    sources: (row.sources as AIMessage["sources"]) || [],
    warnings: (row.warnings as AIMessage["warnings"]) || [],
    suggestedActions: (row.suggested_actions as string[]) || [],
    createdAt: row.created_at as string,
  };
}

export async function createAIConversation(input: {
  clientId?: string;
  contextType: "manager_dashboard" | "client_card";
}): Promise<AIActionResult<AIConversation>> {
  const token = await authToken();
  if (!token.success) return token;
  const response = await apiPost<Record<string, unknown>>("/ai/conversations", input, token.data);
  return response.error ? failed(response.error) : { success: true, data: mapConversation(response.data) };
}

export async function getAIConversations(
  status: "active" | "archived" = "active",
  clientId?: string,
): Promise<AIActionResult<AIConversation[]>> {
  const token = await authToken();
  if (!token.success) return token;
  const query = new URLSearchParams({ status, limit: "50" });
  if (clientId) query.set("clientId", clientId);
  const response = await apiGet<Record<string, unknown>[]>(`/ai/conversations?${query}`, token.data);
  return response.error
    ? failed(response.error)
    : { success: true, data: (response.data || []).map(mapConversation) };
}

export async function getAIConversation(
  id: string,
): Promise<AIActionResult<{ conversation: AIConversation; messages: AIMessage[] }>> {
  const token = await authToken();
  if (!token.success) return token;
  const response = await apiGet<Record<string, unknown> & { messages: Record<string, unknown>[] }>(
    `/ai/conversations/${id}`,
    token.data,
  );
  return response.error
    ? failed(response.error)
    : {
        success: true,
        data: {
          conversation: mapConversation(response.data),
          messages: (response.data.messages || []).map(mapMessage),
        },
      };
}

export async function sendAIMessage(
  id: string,
  content: string,
): Promise<AIActionResult<{ userMessage: AIMessage; assistantMessage: AIMessage }>> {
  const token = await authToken();
  if (!token.success) return token;
  const response = await apiPost<{
    userMessage: Record<string, unknown>;
    assistantMessage: Record<string, unknown>;
  }>(`/ai/conversations/${id}/messages`, { content }, token.data);
  return response.error
    ? failed(response.error)
    : {
        success: true,
        data: {
          userMessage: mapMessage(response.data.userMessage),
          assistantMessage: mapMessage(response.data.assistantMessage),
        },
      };
}

export async function setAIConversationState(
  id: string,
  action: "archive" | "restore",
): Promise<AIActionResult<null>> {
  const token = await authToken();
  if (!token.success) return token;
  const response = await apiPatch(`/ai/conversations/${id}/${action}`, {}, token.data);
  return response.error ? failed(response.error) : { success: true, data: null };
}

export async function deleteAIConversation(id: string): Promise<AIActionResult<null>> {
  const token = await authToken();
  if (!token.success) return token;
  const response = await apiDelete(`/ai/conversations/${id}`, token.data);
  return response.error ? failed(response.error) : { success: true, data: null };
}
