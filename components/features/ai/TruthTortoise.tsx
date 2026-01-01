'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type TruthTortoiseProps = {
  context?: string;
};

function TurtleIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] transition-transform ${
        active ? 'rotate-6 scale-110' : 'scale-100'
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 13c0-2 1-4 3-5l2-1h6l2 1c2 1 3 3 3 5v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2z" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M6 9l-2 1M18 9l2 1M8 18l-2 2M16 18l2 2" />
      </svg>
    </span>
  );
}

export function TruthTortoise({ context }: TruthTortoiseProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { id: String(Date.now()), role: 'user', content: trimmed },
    ];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const prompt = context
      ? `Context: ${context}\nUser question: ${trimmed}`
      : trimmed;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const reply = data.text || 'No response yet.';
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div
        className={`flex flex-col items-end gap-3 transition-all ${
          open ? 'opacity-100' : 'opacity-95'
        }`}
      >
        {open ? (
          <div className="w-[320px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <TurtleIcon active={true} />
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Truth Tortoise</p>
                  <p className="text-xs text-[var(--muted)]">Ask anything about the universe</p>
                </div>
              </div>
              <button
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-3 text-sm">
              {messages.length === 0 ? (
                <p className="text-[var(--muted)]">Ask your first question to unlock the truth.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-xl px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-[var(--surface-2)] text-[var(--foreground)]'
                        : 'bg-[var(--accent)]/10 text-[var(--foreground)]'
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
              {loading ? (
                <div className="rounded-xl bg-[var(--surface-2)] px-3 py-2 text-[var(--muted)]">
                  Thinking...
                </div>
              ) : null}
            </div>
            <div className="border-t border-[var(--border)] px-4 py-3">
              <textarea
                ref={inputRef}
                rows={2}
                placeholder="Ask Truth Tortoise..."
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={sendMessage} disabled={loading}>
                  {loading ? 'Asking...' : 'Ask'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <button
          className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-lg transition-transform hover:-translate-y-1"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <TurtleIcon active={open} />
          <span className="text-sm font-semibold text-[var(--foreground)]">Ask Truth Tortoise</span>
        </button>
      </div>
    </div>
  );
}
