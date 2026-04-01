import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const track_packageSchema = z.object({
  tracking_code: z.string().describe("Tracking code"),
});

export async function handleTrackPackage(params: z.infer<typeof track_packageSchema>): Promise<string> {
  const result = await client.request("GET", `/srorastro/v1/objetos/${params.tracking_code}`);
  return JSON.stringify(result, null, 2);
}
