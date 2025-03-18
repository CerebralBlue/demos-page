import axios from "axios";

type ChatMessage = {
    message: string;
    type: "user" | "agent";
    isFile?: boolean;
    fileName?: string;
};

type MaistroParams = {
    name: string;
    value: string;
};

type MaistroCallBody = {
    agent: string;
    params: MaistroParams[];
    options: {
        returnVariables: boolean;
        returnVariablesExpanded: boolean;
    };
};

export class NeuralSeekService {
    private static readonly STAGING_API = "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro";
    private static readonly UPLOAD_API = "https://stagingconsoleapi.neuralseek.com/SEC-demo/exploreUpload";
    private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
    private static readonly HEADERS = { "Content-Type": "application/json" };

    static async uploadFile(file: File): Promise<string | null> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post(this.UPLOAD_API, formData, {
                headers: this.HEADERS,
            });
            return response.data.fileName;
        } catch (error) {
            console.error("File upload error:", error);
            return null;
        }
    }

    static async processOCR(fileName: string): Promise<string | null> {
        try {
            const body: MaistroParams[] = [{ name: "fileName", value: fileName }];
            const response = await axios.post(this.STAGING_API, { agent: "ocr_sheet", params: body, options: { returnVariables: true, returnVariablesExpanded: false } }, { headers: this.HEADERS });
            return response.data;
        } catch (error) {
            console.error("Error processing OCR:", error);
            return null;
        }
    }

    static async ingestData(fileName: string, fileType: string, data: string): Promise<boolean> {
        try {
            const baseUrl = "${process.env.NEXT_PUBLIC_API_BASE_URL}/ingestions";
            await axios.post(baseUrl, { file_name: fileName, type: fileType, data }, { headers: this.HEADERS });
            return true;
        } catch (error) {
            console.error("Ingestion failed", error);
            return false;
        }
    }

    static async sendMessage(message: string): Promise<string> {
        try {
            const body: MaistroCallBody = {
                agent: "chat_agent",
                params: [{ name: "message", value: message }],
                options: { returnVariables: false, returnVariablesExpanded: false },
            };

            const response = await axios.post(this.STAGING_API, body, { headers: this.HEADERS });
            return response.data.answer || "No response received.";
        } catch (error) {
            console.error(error);
            return "Error processing your request.";
        }
    }
}