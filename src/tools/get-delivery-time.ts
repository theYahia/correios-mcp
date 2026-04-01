import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const get_delivery_timeSchema = z.object({
  cepOrigem: z.string().describe("Origin ZIP"),
  cepDestino: z.string().describe("Destination ZIP"),
  servico: z.string().default("04014").describe("Service code"),
});

export async function handleGetDeliveryTime(params: z.infer<typeof get_delivery_timeSchema>): Promise<string> {
  const result = await client.request("POST", "/prazo/v1/nacional", params);
  return JSON.stringify(result, null, 2);
}
