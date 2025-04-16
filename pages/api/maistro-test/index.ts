import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 
const url = "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro";
const headers = {
    "accept": "application/json",
    "apikey": "6c5aca86-d343615d-60a44b29-c6dbb084",
    "Content-Type": "application/json"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = {
            "agent": "query_report",
            "params": [],
            "options": {
                "streaming": false,
                "llm": "",
                "user_id": "",
                "timeout": 600000,
                "temperatureMod": 1,
                "toppMod": 1,
                "freqpenaltyMod": 1,
                "minTokens": 0,
                "maxTokens": 1,
                "lastTurn": [{ "input": "", "response": "" }],
                "returnVariables": false,
                "returnVariablesExpanded": false,
                "returnRender": false,
                "returnSource": false,
                "maxRecursion": 10
            }
        };

        const response = await axios.post(url, data, { headers });
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
