import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const create_shipmentSchema = z.object({
  remetente: z.string().describe("Sender JSON"),
  destinatario: z.string().describe("Recipient JSON"),
  servico: z.string().describe("Service code"),
  peso: z.number().describe("Weight kg"),
});

export async function handleCreateShipment(params: z.infer<typeof create_shipmentSchema>): Promise<string> {
  const result = await client.request("POST", "/prepostagem/v1/prepostagens", params);
  return JSON.stringify(result, null, 2);
}
