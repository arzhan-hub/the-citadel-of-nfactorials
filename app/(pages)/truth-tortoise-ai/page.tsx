'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function TruthTortoiseAIPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const ask = async () => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: trimmed },
    ]);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        const details = typeof data.details === 'string' ? data.details : '';
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: details ? `Error: ${details}` : t('errors.failed'),
          },
        ]);
        return;
      }
      const text = typeof data.text === 'string' ? data.text.trim() : '';
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: text || t('errors.noResponse'),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: t('errors.something') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12">
      <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="order-2 p-0 md:order-1">
          <img
            src="/truth-tortoise-hero.png"
            alt="Truth Tortoise"
            className="h-64 w-full object-contain sm:h-80"
          />
        </div>
        <div className="order-1 space-y-4 md:order-2">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{t('truth.title')}</p>
          <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl md:text-5xl">
            {t('truth.headline')}
          </h1>
          <p className="text-sm text-[var(--muted)] sm:text-base">{t('truth.description')}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20">
              <img src="/truth-tortoise.png" alt="" className="h-6 w-6 rounded-full object-cover" />
            </span>
            {t('truth.prompt')}
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder={t('truth.askPlaceholder')}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  ask();
                }
              }}
              className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            />
            <Button onClick={ask} disabled={loading}>
              {loading ? t('truth.asking') : t('truth.askButton')}
            </Button>
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--foreground)]">
            {messages.length === 0 ? (
              <p className="text-[var(--muted)]">{t('truth.chatEmpty')}</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-[var(--surface)] text-[var(--foreground)]'
                      : 'bg-[var(--accent)]/10 text-[var(--foreground)]'
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
            {loading ? (
              <div className="rounded-xl bg-[var(--surface)] px-3 py-2 text-[var(--muted)]">{t('truth.thinking')}</div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>
      </section>
    </main>
  );
}
