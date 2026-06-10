import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Copy, KeyRound, Plus, ShieldOff, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import { listApiKeys, createApiKey, revokeApiKey, type ApiKey } from '@/lib/api-keys';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading, hasFullAccess } = useAuth();
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKey, setRevealedKey] = useState<{ name: string; plaintext: string } | null>(null);

  useEffect(() => {
    document.getElementById('bot-content')?.remove();
  }, []);

  useEffect(() => {
    if (!user || !hasFullAccess) return;
    listApiKeys()
      .then((data) => setKeys(data))
      .catch((e) => toast.error(e.message ?? 'Failed to load API keys'));
  }, [user, hasFullAccess]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ghost-dark flex items-center justify-center text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      toast.error(t('settings.api.error_name', 'Donnez un nom à votre clé'));
      return;
    }
    setBusy(true);
    try {
      const created = await createApiKey(newKeyName);
      setRevealedKey({ name: created.meta.name, plaintext: created.plaintext });
      setKeys((prev) => (prev ? [created.meta, ...prev] : [created.meta]));
      setCreateOpen(false);
      setNewKeyName('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create key';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm(t('settings.api.confirm_revoke', 'Révoquer cette clé ? Tous les appels API échoueront immédiatement.'))) return;
    setBusy(true);
    try {
      await revokeApiKey(id);
      setKeys((prev) =>
        prev ? prev.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k)) : null,
      );
      toast.success(t('settings.api.revoked', 'Clé révoquée'));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to revoke key';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => toast.success('Copied'));
  };

  const activeKeys = keys?.filter((k) => !k.revoked_at) ?? [];
  const revokedKeys = keys?.filter((k) => k.revoked_at) ?? [];

  return (
    <div className="min-h-screen bg-ghost-dark text-white flex flex-col">
      <Helmet>
        <title>Settings | GhostMeta</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <Breadcrumb items={[{ label: t('settings.breadcrumb', 'Settings') }]} />

      <main className="flex-1 container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-2">{t('settings.title', 'Settings')}</h1>
        <p className="text-white/60 mb-10">{t('settings.subtitle', 'Manage your API keys and account access.')}</p>

        {!hasFullAccess && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-200 mb-1">
                {t('settings.api.gated_title', 'API access requires Pro B2B')}
              </h2>
              <p className="text-sm text-amber-100/80">
                {t('settings.api.gated_body', 'The REST API is part of the Pro B2B tier ($19/mo). Visit the pricing page to upgrade.')}
              </p>
              <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                <a href="/pricing">{t('settings.api.gated_cta', 'See Pro B2B')}</a>
              </Button>
            </div>
          </div>
        )}

        {hasFullAccess && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-semibold">{t('settings.api.title', 'API keys')}</h2>
                </div>
                <p className="text-sm text-white/60 max-w-xl">
                  {t('settings.api.desc', 'Use these keys to authenticate calls to /api/v1/inspect and /api/v1/strip. Keys are shown once at creation — store them securely.')}
                </p>
              </div>
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex-shrink-0"
                disabled={busy}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {t('settings.api.new', 'New key')}
              </Button>
            </div>

            {keys === null ? (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('settings.api.loading', 'Loading…')}
              </div>
            ) : activeKeys.length === 0 ? (
              <p className="text-sm text-white/50 italic">
                {t('settings.api.empty', 'No active keys yet. Create one to start calling the API.')}
              </p>
            ) : (
              <ul className="space-y-3">
                {activeKeys.map((k) => (
                  <li
                    key={k.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 p-4"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm mb-0.5">{k.name}</div>
                      <div className="font-mono text-xs text-white/50">
                        {k.key_prefix}…{' · '}
                        {k.last_used_at
                          ? `${t('settings.api.last_used', 'last used')} ${new Date(k.last_used_at).toLocaleDateString()}`
                          : t('settings.api.never_used', 'never used')}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevoke(k.id)}
                      disabled={busy}
                      className="border-red-400/40 text-red-300 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <ShieldOff className="w-3.5 h-3.5 mr-1.5" />
                      {t('settings.api.revoke', 'Revoke')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {revokedKeys.length > 0 && (
              <details className="mt-6">
                <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                  {t('settings.api.show_revoked', 'Show revoked keys')} ({revokedKeys.length})
                </summary>
                <ul className="mt-3 space-y-2">
                  {revokedKeys.map((k) => (
                    <li key={k.id} className="text-xs text-white/40 font-mono">
                      {k.key_prefix}… — {k.name} — revoked {new Date(k.revoked_at!).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}
      </main>

      <Footer />

      <Dialog open={createOpen} onOpenChange={(o) => !busy && setCreateOpen(o)}>
        <DialogContent className="bg-zinc-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{t('settings.api.create_title', 'Create API key')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="block mb-2 text-white/70">{t('settings.api.name_label', 'Key name (visible to you only)')}</span>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="production / agency-client-x / etc."
                maxLength={80}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
              />
            </label>
            <Button
              onClick={handleCreate}
              disabled={busy || !newKeyName.trim()}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : t('settings.api.create_btn', 'Generate key')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revealedKey} onOpenChange={(o) => !o && setRevealedKey(null)}>
        <DialogContent className="bg-zinc-900 border border-cyan-400/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              {t('settings.api.reveal_title', 'Save this key now')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              {t(
                'settings.api.reveal_warning',
                'This is the only time the full key is shown. Copy it into your secrets manager — it cannot be recovered later.',
              )}
            </p>
            <div className="rounded-lg border border-white/15 bg-black/60 p-3 font-mono text-xs break-all">
              {revealedKey?.plaintext}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => revealedKey && handleCopy(revealedKey.plaintext)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                {t('settings.api.copy', 'Copy')}
              </Button>
              <Button variant="outline" onClick={() => setRevealedKey(null)} className="border-white/20">
                {t('settings.api.done', 'Done')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
