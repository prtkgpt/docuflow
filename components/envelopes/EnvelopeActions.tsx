"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, Loader2 } from "lucide-react";

export function EnvelopeActions({
  envelopeId,
  status,
  canRemind,
}: {
  envelopeId: string;
  status: string;
  canRemind: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"remind" | "void" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function remind() {
    setBusy("remind"); setMsg(null);
    try {
      const res = await fetch(`/api/envelopes/${envelopeId}/remind`, { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Could not send reminder");
      setMsg(`Sent ${j.remindersSent} reminder(s).`);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function voidEnv() {
    if (!confirm("Cancel this envelope? Recipients will no longer be able to sign.")) return;
    setBusy("void"); setMsg(null);
    try {
      const res = await fetch(`/api/envelopes/${envelopeId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Cancel failed");
      }
      router.push("/dashboard/envelopes");
    } catch (e: any) {
      setMsg(e.message);
      setBusy(null);
    }
  }

  const cancelable = status !== "completed" && status !== "voided";
  return (
    <div className="flex items-center gap-2">
      {canRemind && (
        <Button variant="outline" onClick={remind} disabled={busy !== null}>
          {busy === "remind" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
          Remind
        </Button>
      )}
      {cancelable && (
        <Button variant="outline" onClick={voidEnv} disabled={busy !== null}>
          {busy === "void" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Cancel
        </Button>
      )}
      {msg && <span className="text-xs text-slate-600">{msg}</span>}
    </div>
  );
}
