"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  emitirNotaFiscal,
  consultarStatusNotaFiscal,
} from "@/lib/actions/nota-fiscal";

type Props = {
  orderId: string;
  nfStatus: string | null;
  nfNumber: string | null;
  nfPdfUrl: string | null;
  nfError: string | null;
};

function statusLabel(status: string | null) {
  switch (status) {
    case "processando_autorizacao":
      return "Processando na prefeitura…";
    case "autorizado":
      return "Nota autorizada";
    case "erro_autorizacao":
    case "erro":
      return "Erro ao emitir";
    case "cancelado":
      return "Nota cancelada";
    default:
      return null;
  }
}

export function NotaFiscalSection({
  orderId,
  nfStatus,
  nfNumber,
  nfPdfUrl,
  nfError,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(nfError);

  function handleEmitir() {
    setError(null);
    startTransition(async () => {
      const result = await emitirNotaFiscal(orderId);
      if (result?.error) setError(result.error);
    });
  }

  function handleConsultar() {
    setError(null);
    startTransition(async () => {
      const result = await consultarStatusNotaFiscal(orderId);
      if (result?.error) setError(result.error);
    });
  }

  const label = statusLabel(nfStatus);

  return (
    <div className="no-print mt-6 rounded-2xl border border-line bg-paper p-5">
      <h2 className="font-display text-lg font-semibold text-ink">
        Nota fiscal
      </h2>

      {!nfStatus && (
        <div className="mt-3">
          <p className="text-sm text-ink-soft">
            Ainda não foi emitida nota fiscal pra essa OS.
          </p>
          <button
            type="button"
            onClick={handleEmitir}
            disabled={isPending}
            className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {isPending ? "Emitindo…" : "Emitir nota fiscal"}
          </button>
          <p className="mt-2 text-xs text-ink-soft">
            Precisa ter{" "}
            <Link href="/dashboard/dados-fiscais" className="underline">
              seus dados fiscais
            </Link>{" "}
            preenchidos e o cliente com CPF/CNPJ cadastrado.
          </p>
        </div>
      )}

      {nfStatus && (
        <div className="mt-3">
          <p className="text-sm font-medium text-ink">{label}</p>
          {nfNumber && (
            <p className="mt-1 font-mono text-sm text-ink-soft">
              Número: {nfNumber}
            </p>
          )}
          {nfPdfUrl && (
            <a
              href={nfPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-ink underline"
            >
              Ver / baixar DANFSE
            </a>
          )}
          {(nfStatus === "processando_autorizacao" || nfStatus === "erro") && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleConsultar}
                disabled={isPending}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink disabled:opacity-60"
              >
                {isPending ? "Consultando…" : "Verificar status"}
              </button>
              {nfStatus === "erro" && (
                <button
                  type="button"
                  onClick={handleEmitir}
                  disabled={isPending}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
                >
                  Tentar de novo
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {error}
        </p>
      )}
    </div>
  );
}
