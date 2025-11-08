import { describe, it, expect } from "vitest";
import apiClient from "@/lib/apiClient";

describe("apiClient", () => {
  it("has correct baseURL and timeout", () => {
    expect(apiClient.defaults.baseURL).toBe("/api");
    expect(apiClient.defaults.timeout).toBe(15000);
  });

  it("response interceptor returns data on success", () => {
    const mockResponse = { data: { content: "test" } };
    const handler = apiClient.interceptors.response.handlers[0].fulfilled;
    const result = handler(mockResponse);
    expect(result).toEqual({ content: "test" });
  });

  it("response interceptor handles error with response data", async () => {
    const error = {
      response: { data: { error: "Custom error" } },
      message: "Network error",
    };
    const handler = apiClient.interceptors.response.handlers[0].rejected;
    
    await expect(handler(error)).rejects.toThrow("Custom error");
  });

  it("response interceptor handles error without response data", async () => {
    const error = { message: "Network error" };
    const handler = apiClient.interceptors.response.handlers[0].rejected;
    
    await expect(handler(error)).rejects.toThrow("Network error");
  });

  it("response interceptor handles error without message", async () => {
    const error = {};
    const handler = apiClient.interceptors.response.handlers[0].rejected;
    
    await expect(handler(error)).rejects.toThrow("请求失败");
  });
});

