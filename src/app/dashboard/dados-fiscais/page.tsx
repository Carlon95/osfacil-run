import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { FiscalDataForm } from "./FiscalDataForm";

export default async function FiscalDataPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/api/auth/invalidate");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-bold text-ink">
        Dados fiscais
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Necessários para emitir nota fiscal (NFS-e) direto pelas suas OS.
      </p>
      <FiscalDataForm
        data={{
          cnpj: user.cnpj,
          inscricaoMunicipal: user.inscricaoMunicipal,
          codigoMunicipio: user.codigoMunicipio,
          optanteSimplesNacional: user.optanteSimplesNacional,
          codigoServicoMunicipal: user.codigoServicoMunicipal,
          aliquotaIss: user.aliquotaIss,
        }}
      />
    </div>
  );
}
