import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const calculate_shippingSchema = z.object({
  cepOrigem: z.string().describe("Origin ZIP"),
  cepDestino: z.string().describe("Destination ZIP"),
  peso: z.number().describe("Weight in kg"),
  servico: z.string().default("04014").describe("Service code (SEDEX=04014, PAC=04510)"),
});

export async function handleCalculateShipping(params: z.infer<typeof calculate_shippingSchema>): Promise<string> {
  const result = await client.request("POST", "/preco/v1/nacional", params);
  return JSON.stringify(result, null, 2);
}
