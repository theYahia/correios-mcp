const BASE_URL = "https://api.correios.com.br";
const TIMEOUT = 15_000;

export class CorreiosClient {
  private correios_user: string;
  private correios_token: string;

  constructor() {
    this.correios_user = process.env.CORREIOS_USER ?? "";
    this.correios_token = process.env.CORREIOS_TOKEN ?? "";
    if (!this.correios_user || !this.correios_token) {
      throw new Error("Environment variable(s) CORREIOS_USER and CORREIOS_TOKEN required. See https://developer.correios.com.br/");
    }
  }

  private getHeaders() { return { "Authorization": `Token ${this.correios_token}`, "User": this.correios_user }; }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          ...this.getHeaders(),
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Correios HTTP ${response.status}: ${text}`);
      }
      const ct = response.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) return response.json();
      return response.text();
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Correios: request timeout (15s).");
      }
      throw error;
    }
  }
}
