import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

process.env.CORREIOS_USER = "test-user";
process.env.CORREIOS_TOKEN = "test-token";

describe("correios-mcp tools", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.resetModules(); });

  it("calculate_shipping works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pcFinal: "25.50", prazoEntrega: 3 }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleCalculateShipping } = await import("../calculate-shipping.js");
    const result = await handleCalculateShipping({ cepOrigem: "01001000", cepDestino: "20040020", peso: 1, servico: "04014" });
    const parsed = JSON.parse(result);
    expect(parsed.pcFinal).toBe("25.50");
  });

  it("track_package works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ objetos: [{ codObjeto: "BR123456789", eventos: [{ descricao: "Objeto entregue" }] }] }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleTrackPackage } = await import("../track-package.js");
    const result = await handleTrackPackage({ tracking_code: "BR123456789" });
    const parsed = JSON.parse(result);
    expect(parsed.objetos[0].codObjeto).toBe("BR123456789");
  });

  it("get_delivery_time works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prazoEntrega: 3, dataMaxima: "2026-04-05" }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleGetDeliveryTime } = await import("../get-delivery-time.js");
    const result = await handleGetDeliveryTime({ cepOrigem: "01001000", cepDestino: "20040020", servico: "04014" });
    const parsed = JSON.parse(result);
    expect(parsed.prazoEntrega).toBe(3);
  });

  it("list_services works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ codigo: "04014", descricao: "SEDEX" }]),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleListServices } = await import("../list-services.js");
    const result = await handleListServices({});
    const parsed = JSON.parse(result);
    expect(parsed[0].descricao).toBe("SEDEX");
  });

  it("get_zip_code works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cep: "01001000", logradouro: "Praça da Sé", localidade: "São Paulo" }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleGetZipCode } = await import("../get-zip-code.js");
    const result = await handleGetZipCode({ cep: "01001000" });
    const parsed = JSON.parse(result);
    expect(parsed.localidade).toBe("São Paulo");
  });

  it("create_shipment works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "ship-1", codigoObjeto: "BR987654321" }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleCreateShipment } = await import("../create-shipment.js");
    const result = await handleCreateShipment({ remetente: "{}", destinatario: "{}", servico: "04014", peso: 1 });
    const parsed = JSON.parse(result);
    expect(parsed.codigoObjeto).toBeTruthy();
  });

  it("get_label works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://label.correios.com.br/abc" }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleGetLabel } = await import("../get-label.js");
    const result = await handleGetLabel({ shipment_id: "ship-1" });
    const parsed = JSON.parse(result);
    expect(parsed.url).toBeTruthy();
  });

  it("cancel_shipment works", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "ship-1", status: "canceled" }),
      headers: new Map([["content-type", "application/json"]]),
    });
    const { handleCancelShipment } = await import("../cancel-shipment.js");
    const result = await handleCancelShipment({ shipment_id: "ship-1" });
    const parsed = JSON.parse(result);
    expect(parsed.status).toBe("canceled");
  });

  it("handles HTTP errors", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, text: async () => "Unauthorized" });
    const { handleCalculateShipping } = await import("../calculate-shipping.js");
    await expect(handleCalculateShipping({ cepOrigem: "01001000", cepDestino: "20040020", peso: 1, servico: "04014" })).rejects.toThrow("Correios HTTP 401");
  });
});
