import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '5844d67b-235fde7c-e2715c01-5139af4e';
const URL_MAISTRO = `https://stagingapi.neuralseek.com/v1/test-juan/maistro`;

async function getTitleSubtitle(question: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'title-subtitle',
      params: [
        {
          name: 'question',
          value: question
        }
      ],
      options: {
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      },
    }),
  });

  const { title, subtitle } = JSON.parse((await response.json()).answer);
  return NextResponse.json({ title, subtitle }, { status: response.status });
}

async function getSteps(question: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'deepthinking-steps',
      params: [
        {
          name: 'db_connection',
          value: 'postgres:Bu190L0laIym@185.187.235.206:5445/sales_db'
        },
        {
          name: 'question',
          value: question
        }
      ],
      options: {
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      }
    })
  });

  let answer = (await response.json()).answer;
  answer = JSON.parse(answer.replace(/\\n/g, '').replace(/\\"/g, '"'));
  return NextResponse.json(answer, { status: response.status });
}

async function getQueryDatabase(description: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'query-database',
      params: [
        {
          name: 'db_connection',
          value: 'postgres:Bu190L0laIym@185.187.235.206:5445/sales_db'
        },
        {
          name: 'description',
          value: description
        }
      ],
      options: {
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      },
    }),
  });

  let answer = (await response.json()).answer;
  return NextResponse.json(answer, { status: response.status });
}

async function getResultsAnalysis(description: string, sqlQueryResults: string, question: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'analyze-query-results',
      params: [
        {
          name: 'description',
          value: description
        },
        {
          name: 'sql_query_results',
          value: sqlQueryResults
        },
        {
          name: 'question',
          value: question
        },
      ],
      options: {
        stream: true,
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      },
    }),
  });

  let answer = (await response.json()).answer;
  return NextResponse.json(answer, { status: response.status });
}

async function getGraph(chartType: string, sqlQueryResults: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'generate-chart-2',
      params: [
        {
          name: 'chart_type',
          value: chartType
        },
        {
          name: 'sql_query_results',
          value: sqlQueryResults
        }
      ],
      options: {
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      },
    }),
  });

  let answer = JSON.parse((await response.json()).answer);
  return NextResponse.json(answer, { status: response.status });
}

async function getFinalResponse(question: string, analysisResults: string) {
  const response = await fetch(URL_MAISTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      agent: 'final-response',
      params: [
        {
          name: 'question',
          value: question
        },
        {
          name: 'analysis_results',
          value: analysisResults
        }
      ],
      options: {
        includeHighlights: true,
        includeSourceResults: true,
        lastTurn: [],
        returnVariables: true,
        returnVariablesExpanded: true,
      },
    }),
  });

  let answer = (await response.json()).answer;
  return NextResponse.json(answer, { status: response.status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.step === 'title-subtitle') {
      return await getTitleSubtitle(body.question);
    } else if (body.step === 'generate-steps') {
      return await getSteps(body.question);
    } else if (body.step === 'get-query-database') {
      return await getQueryDatabase(body.description);
    } else if (body.step === 'get-results-analysis') {
      return await getResultsAnalysis(body.description, body.sqlQueryResults, body.question);
    } else if (body.step === 'get-graph') {
      return await getGraph(body.chartType, body.sqlQueryResults);
    } else {
      return await getFinalResponse(body.question, body.analysisResults);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
