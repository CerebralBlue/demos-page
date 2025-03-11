// import yahooFinance from "yahoo-finance2";

// // Suppress unnecessary warnings
// yahooFinance.suppressNotices(['yahooSurvey']);

// export default async function handler(req: any, res: any) {
//     try {
//         const symbol = req.query.symbol || "BAC";
//         const result = await yahooFinance.quoteSummary(symbol, { modules: ["incomeStatementHistory", "balanceSheetHistory", "cashflowStatementHistory"] });

//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Yahoo Finance API Error:", error);
//         res.status(500).json({ error: "Failed to fetch financial data" });
//     }
// }


import yahooFinance from "yahoo-finance2";

// Suppress unnecessary warnings
yahooFinance.suppressNotices(["yahooSurvey"]);

export default async function handler(req: any, res: any) {
    try {
        const symbol = req.query.symbol || "BAC";
        
        // Fetch financial data
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: [
                "incomeStatementHistory",
                "balanceSheetHistory",
                "cashflowStatementHistory"
            ]
        });

        // Extract relevant years
        const extractYearlyData = (data: any) => {
            return data?.map((item: any) => ({
                year: new Date(item.endDate).getFullYear(),
                data: item
            // })).filter((entry: any) => [2022, 2023, 2024].includes(entry.year));
            })).filter((entry: any) => [2022].includes(entry.year));
        };

        const incomeStatements = extractYearlyData(result.incomeStatementHistory?.incomeStatementHistory);
        const balanceSheets = extractYearlyData(result.balanceSheetHistory?.balanceSheetStatements);
        const cashFlows = extractYearlyData(result.cashflowStatementHistory?.cashflowStatements);

        res.status(200).json({
            symbol,
            incomeStatements,
            balanceSheets,
            cashFlows
        });
    } catch (error) {
        console.error("Yahoo Finance API Error:", error);
        res.status(500).json({ error: "Failed to fetch financial data" });
    }
}
