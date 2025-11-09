import { describe, it, expect, vi } from "vitest";
import { NextApiRequest, NextApiResponse } from "next"; // Import types
import handler from "../bookInfo"; // Import your API handler
import axios from "axios"; // Import axiosq
import { bookInfo } from "./res";

type AxiosMock = {
  mockResolvedValue: (value: { data: typeof bookInfo.resHtml }) => void;
};

// Mock axios
vi.mock("axios");

describe("API Handler", () => {
  it("should return a 200 status and correct data", async () => {
    const req: NextApiRequest = {
      method: "GET",
      query: {
        url: "https://quanben.io/n/chongshengbiannuwangnaxiatezhongduizhang/",
      },
      cookies: {},
      body: {},
    } as unknown as NextApiRequest; // Type assertion

    const res: NextApiResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse; // Type assertion

    // Mock the Axios GET request
    (axios.get as unknown as AxiosMock).mockResolvedValue({
      data: bookInfo.resHtml, // Mocked response data
      status: 200, // Add status to mock response
    });

    await handler(req, res); // Call API handler

    expect(res.status).toHaveBeenCalledWith(200); // Check status code
    expect(res.json).toHaveBeenCalledWith(bookInfo.expectRes); // Check returned data
  });
});
