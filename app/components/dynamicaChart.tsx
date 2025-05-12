
import React from "react";

import {
  Bar,
  Line,
  Doughnut,
  Pie,
  Scatter,
  Bubble,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const chartComponents: any = {
  bar: Bar,
  line: Line,
  doughnut: Doughnut,
  pie: Pie,
  scatter: Scatter,
  bubble: Bubble,
};

type Props = {
  config: {
    type: string;
    labels: string[] | any;
    datasets: any[];
  };
};

const DynamicChart: React.FC<Props> = ({ config }) => {
    let { type, labels, datasets } = config;
  
    if (type === "area") {
        type = "line";
        datasets = datasets.map(ds => ({ ...ds, fill: true }));
      } else if (type === "column") {
        type = "bar";
      }
  
    const ChartComponent = chartComponents[type];
  
    if (!ChartComponent) {
      return <div>Unsupported chart type: {type}</div>;
    }
  
    const data = { labels, datasets };
  
    return (
      <div className="p-4">
        <ChartComponent data={data} options={{ responsive: true }} />
      </div>
    );
  };

export default DynamicChart;