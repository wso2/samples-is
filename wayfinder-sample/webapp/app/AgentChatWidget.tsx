"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "./lib/auth/client";

type ChatRole = "user" | "assistant" | "system";
type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface ChatMessage {
  authorizationUrl?: string;
  id: string;
  role: ChatRole | "error";
  content: string;
}

interface AgentPayload {
  authorizationRequestId?: string;
  authorizationUrl?: string;
  type?: "ready" | "processing" | "response" | "error" | "authorization_required" | "obo_required";
  message?: string;
}

const AGENT_CHAT_URL = process.env.NEXT_PUBLIC_AGENT_CHAT_URL || "ws://localhost:8791/chat";
const AGENT_HTTP_BASE_URL = process.env.NEXT_PUBLIC_AGENT_HTTP_BASE_URL || toHttpBaseUrl(AGENT_CHAT_URL);

function toHttpBaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.protocol = parsed.protocol === "wss:" ? "https:" : "http:";
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:8791";
  }
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    content,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
  };
}

function toAgentMessages(messages: ChatMessage[]) {
  return messages
    .filter((message): message is ChatMessage & { role: ChatRole } => (
      message.role === "user" || message.role === "assistant" || message.role === "system"
    ))
    .map(({ role, content }) => ({ role, content }));
}

async function fetchOboAuthorizeUrl(authorizationRequestId: string, accessToken: string) {
  const response = await fetch(`${AGENT_HTTP_BASE_URL}/obo/authorize-url`, {
    body: JSON.stringify({ authorizationRequestId }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const body = await response.json().catch(() => ({})) as { authorizationUrl?: string; error?: string };

  if (!response.ok || !body.authorizationUrl) {
    throw new Error(body.error || "Unable to prepare the authorization link.");
  }

  return body.authorizationUrl;
}

function AgentLauncherIcon() {
  return (
    <svg
      aria-hidden="true"
      className="agent-chat-launcher-icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M12 3v3" />
      <path d="M7 9h10a4 4 0 0 1 4 4v1a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-1a4 4 0 0 1 4-4Z" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
      <path d="M9 19l-2 2" />
      <path d="M15 19l2 2" />
    </svg>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      parts.push(
        <a href={match[3]} key={`link-${match.index}`} rel="noreferrer" target="_blank">
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      parts.push(<code key={`code-${match.index}`}>{match[4]}</code>);
    } else if (match[5]) {
      parts.push(<strong key={`strong-${match.index}`}>{match[5]}</strong>);
    } else if (match[6]) {
      parts.push(<em key={`em-${match.index}`}>{match[6]}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function parseTableRow(line: string): string[] | null {
  const trimmed = line.trim();

  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return null;
  }

  const cells = trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
  const isSeparator = cells.every((cell) => /^:?-{3,}:?$/.test(cell));

  return isSeparator ? [] : cells;
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let tableRows: string[][] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p key={`p-${blocks.length}`}>
        {renderInlineMarkdown(paragraph.join(" "))}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    const ListTag = listOrdered ? "ol" : "ul";
    blocks.push(
      <ListTag key={`list-${blocks.length}`}>
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ListTag>
    );
    listItems = [];
  };

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const [header, ...rows] = tableRows;
    blocks.push(
      <div className="agent-chat-table-wrap" key={`table-${blocks.length}`}>
        <table>
          <thead>
            <tr>
              {header.map((cell, index) => (
                <th key={`${cell}-${index}`}>{renderInlineMarkdown(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{renderInlineMarkdown(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const tableCells = parseTableRow(trimmed);

    if (!trimmed) {
      flushAll();
      return;
    }

    if (tableCells) {
      flushParagraph();
      flushList();
      if (tableCells.length > 0) tableRows.push(tableCells);
      return;
    }

    flushTable();

    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h-${blocks.length}`}>
          {renderInlineMarkdown(headingMatch[1])}
        </h3>
      );
      return;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextOrdered = Boolean(orderedMatch);
      if (listItems.length > 0 && listOrdered !== nextOrdered) flushList();
      listOrdered = nextOrdered;
      listItems.push((orderedMatch || unorderedMatch)?.[1] ?? "");
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushAll();

  return <div className="agent-chat-markdown">{blocks}</div>;
}

export default function AgentChatWidget() {
  const { accessToken, isSignedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage("assistant", "Hi, I can help with enterprise travel policies, users, roles, and compliant fares."),
  ]);
  const socketRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const statusLabel = useMemo(() => {
    if (connectionStatus === "connected") return "Connected";
    if (connectionStatus === "connecting") return "Connecting";
    return "Offline";
  }, [connectionStatus]);

  useEffect(() => {
    if (!isOpen || !accessToken) {
      return;
    }

    setConnectionStatus("connecting");
    const socket = new WebSocket(AGENT_CHAT_URL, ["bearer", accessToken]);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnectionStatus("connected");
    });

    socket.addEventListener("message", async (event) => {
      let payload: AgentPayload;

      try {
        payload = JSON.parse(String(event.data)) as AgentPayload;
      } catch {
        return;
      }

      if (payload.type === "processing") {
        setIsProcessing(true);
      }

      if (payload.type === "response") {
        setIsProcessing(false);
        setMessages((current) => [
          ...current,
          createMessage("assistant", payload.message || "Done."),
        ]);
      }

      if (payload.type === "error") {
        setIsProcessing(false);
        setMessages((current) => [
          ...current,
          createMessage("error", payload.message || "The assistant could not process that request."),
        ]);
      }

      if (payload.type === "obo_required") {
        setIsProcessing(false);

        if (!payload.authorizationRequestId) {
          setMessages((current) => [
            ...current,
            createMessage("error", "The assistant could not prepare an authorization request."),
          ]);
          return;
        }

        try {
          const authorizationUrl = await fetchOboAuthorizeUrl(payload.authorizationRequestId, accessToken);

          setMessages((current) => [
            ...current,
            {
              ...createMessage("assistant", payload.message || "Please approve this action to continue."),
              authorizationUrl,
            },
          ]);
        } catch (error) {
          setMessages((current) => [
            ...current,
            createMessage("error", error instanceof Error ? error.message : "Unable to prepare the authorization link."),
          ]);
        }
      }

      if (payload.type === "authorization_required" && payload.authorizationUrl) {
        setIsProcessing(false);
        setMessages((current) => [
          ...current,
          {
            ...createMessage("assistant", payload.message || "Please approve this action to continue."),
            authorizationUrl: payload.authorizationUrl,
          },
        ]);
      }
    });

    socket.addEventListener("close", () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      setConnectionStatus("disconnected");
      setIsProcessing(false);
    });

    socket.addEventListener("error", () => {
      setConnectionStatus("disconnected");
      setIsProcessing(false);
    });

    return () => {
      socket.close();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [accessToken, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isProcessing, isOpen]);

  useEffect(() => {
    if (isOpen && !isProcessing) {
      inputRef.current?.focus();
    }
  }, [isOpen, isProcessing]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    const socket = socketRef.current;

    if (!content || isProcessing) {
      return;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setMessages((current) => [
        ...current,
        createMessage("error", "The AI agent is offline. Start the agent server and try again."),
      ]);
      return;
    }

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsProcessing(true);
    socket.send(JSON.stringify({
      messages: toAgentMessages(nextMessages),
      orgName: user?.orgName || undefined,
    }));
  }

  if (!isSignedIn || !accessToken) {
    return null;
  }

  return (
    <div className="agent-chat-widget">
      {isOpen && (
        <section className="agent-chat-panel" aria-label="AI assistant">
          <header className="agent-chat-header">
            <div>
              <span className="agent-chat-kicker">AI assistant</span>
              <h2>Wayfinder</h2>
            </div>
            <div className="agent-chat-actions">
              <span className={`agent-chat-status agent-chat-status--${connectionStatus}`}>
                {statusLabel}
              </span>
              <button
                className="agent-chat-icon-button"
                type="button"
                aria-label="Close AI assistant"
                onClick={() => setIsOpen(false)}
              >
                X
              </button>
            </div>
          </header>

          <div className="agent-chat-messages" role="log" aria-live="polite">
            {messages.map((message) => (
              <div className={`agent-chat-message agent-chat-message--${message.role}`} key={message.id}>
                <MarkdownMessage content={message.content} />
                {message.authorizationUrl ? (
                  <a
                    className="agent-chat-authorization-link"
                    href={message.authorizationUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Authorize action
                  </a>
                ) : null}
              </div>
            ))}
            {isProcessing && (
              <div className="agent-chat-message agent-chat-message--assistant agent-chat-message--typing">
                Working...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="agent-chat-composer" onSubmit={handleSubmit}>
            <label className="agent-chat-input-label">
              <span>Message</span>
              <input
                ref={inputRef}
                autoComplete="off"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about policies, users, roles, or fares"
                disabled={isProcessing}
              />
            </label>
            <button
              className="agent-chat-send-button"
              type="submit"
              disabled={isProcessing || !input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        className="agent-chat-launcher"
        type="button"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <AgentLauncherIcon />
      </button>
    </div>
  );
}
