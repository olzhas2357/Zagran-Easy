export interface AISource { id: string; title: string; category: string }
export interface AIWarning { type: "verification_required" | "missing_information"; message: string }
export interface AIConversation { id: string; title: string; contextType: "manager_dashboard" | "client_card"; status: "active" | "archived"; client: { id: string; name: string } | null; lastMessagePreview: string | null; lastMessageAt: string | null; createdAt: string; updatedAt: string }
export interface AIMessage { id: string; conversationId: string; role: "user" | "assistant"; content: string; status: "pending" | "completed" | "failed"; sources: AISource[]; warnings: AIWarning[]; suggestedActions: string[]; createdAt: string }
