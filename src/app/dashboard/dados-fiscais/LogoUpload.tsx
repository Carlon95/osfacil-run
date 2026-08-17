"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { updateLogo, removeLogo } from "@/lib/actions/fiscal";

export function LogoUpload({ logoUrl }: { logoUrl: string | null }) {
  const [state, formAction, pending] = useActionState(updateLogo, null);
  const [preview, setPreview] = useState<string | null>(logoUrl);
  const [isRemoving, startRemoveTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    startRemoveTransition(() => removeLogo());
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Logo
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        Aparece no cabeçalho da OS impressa/PDF. Ideal: fundo transparente,
        até 1 MB.
      </p>

      <form action={formAction} className="mt-3 flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-paper-dim">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Logo do negócio"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-ink-soft">Sem logo</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {state?.error && (
            <p className="text-xs text-status-open">{state.error}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-paper-dim file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink hover:file:bg-line"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
            >
              {pending ? "Enviando…" : "Salvar logo"}
            </button>
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink-soft hover:border-ink hover:text-ink disabled:opacity-60"
              >
                {isRemoving ? "Removendo…" : "Remover"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
