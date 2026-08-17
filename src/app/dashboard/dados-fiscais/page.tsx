import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { LogoUpload } from "./LogoUpload";
import { BusinessProfileForm } from "./BusinessProfileForm";
import { FiscalDataForm } from "./FiscalDataForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/api/auth/invalidate");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-bold text-ink">Perfil</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Marca, negócio e dados fiscais — usados na OS e na nota fiscal.
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <LogoUpload logoUrl={user.logoUrl} />

        <div className="mt-6 border-t border-dashed border-line pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Negócio
          </h3>
          <BusinessProfileForm
            businessName={user.businessName}
            phone={user.phone}
          />
        </div>
      </div>

      <h2 className="mt-8 font-display text-xl font-semibold text-ink">
        Dados fiscais
      </h2>
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
