import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  businessName: z.string().trim().optional(),
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  professionOther: z.string().trim().optional(),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
});

export const logInSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente"),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  document: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  address: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const serviceOrderItemSchema = z.object({
  description: z.string().trim().min(1, "Descreva o item"),
  quantity: z.coerce.number().positive("Quantidade inválida"),
  unitPrice: z.coerce.number().min(0, "Valor inválido"),
});

export const serviceOrderSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente").optional(),
  newClientName: z.string().trim().optional(),
  newClientPhone: z.string().trim().optional(),
  serviceType: z.string().trim().min(2, "Informe o tipo de serviço"),
  description: z.string().trim().min(2, "Descreva o serviço"),
  laborCost: z.coerce.number().min(0, "Valor inválido").default(0),
  scheduledDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  items: z.array(serviceOrderItemSchema).default([]),
});

export const osStatusSchema = z.enum([
  "ABERTA",
  "EM_ANDAMENTO",
  "CONCLUIDA",
  "CANCELADA",
]);

export const fiscalDataSchema = z.object({
  cnpj: z.string().trim().optional(),
  inscricaoMunicipal: z.string().trim().optional(),
  codigoMunicipio: z.string().trim().optional(),
  optanteSimplesNacional: z.string().trim().optional(),
  codigoServicoMunicipal: z.string().trim().optional(),
  aliquotaIss: z.string().trim().optional(),
});
