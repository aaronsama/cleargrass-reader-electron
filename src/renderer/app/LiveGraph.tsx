import React, {
  useEffect,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import {
  AllDataListenerCallback,
  DataStoredListenerCallback,
} from "../../types";
import Chart from "react-apexcharts";

type Series = {
  name: "temperature" | "humidity";
  data: { x: number; y: number }[];
};

const useSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    window.ipc.requestAllData();

    const dataListener: AllDataListenerCallback = (_event, data) => {
      const series = data.reduce<Series[]>(
        (acc: Series[], reading) => {
          acc[0].data.push({
            x: new Date(reading.timestamp).getTime(),
            y: reading.temperature,
          });
          acc[1].data.push({
            x: new Date(reading.timestamp).getTime(),
            y: reading.humidity,
          });

          return acc;
        },
        [
          {
            name: "temperature",
            data: [],
          },
          {
            name: "humidity",
            data: [],
          },
        ],
      );

      setSeries(series);

      const newDataListener: DataStoredListenerCallback = (
        _event,
        storedReading,
      ) => {
        console.log(storedReading);
        const timestamp = new Date(storedReading.timestamp).getTime();

        setSeries((series) => [
          {
            ...series[0],
            data: [
              ...series[0].data,
              { x: timestamp, y: storedReading.temperature },
            ],
          },
          {
            ...series[1],
            data: [
              ...series[1].data,
              { x: timestamp, y: storedReading.humidity },
            ],
          },
        ]);
      };

      window.ipc.onNewDataStored(newDataListener);

      return () => {
        console.log("takedown ordered");
        window.ipc.removeNewDataStoredListener(newDataListener);
      };
    };

    window.ipc.onAllDataReply(dataListener);
  }, []);

  return series;
}

const LiveGraph = () => {
  const chartOptions = {
    chart: {
      id: "history-graph",
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (val: number, timestamp: number) =>
          new Date(timestamp).toLocaleString(),
        rotate: -45,
      },
    },
    yaxis: [
      {
        seriesName: "Temperature",
        max: 55,
        title: {
          text: "Temperature",
          style: {
            color: "#008FFB",
          },
        },
        axisBorder: {
          show: true,
          color: "#008FFB",
        },
        labels: {
          style: {
            color: "#008FFB",
          },
        },
      },
      {
        seriesName: "Humidity",
        opposite: true,
        max: 100,
        title: {
          text: "Humidity",
          style: {
            color: "#00E396",
          },
        },
        axisBorder: {
          show: true,
          color: "#00E396",
        },
        labels: {
          style: {
            color: "#00E396",
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
  };

  const series = useSeries();

  return (
    <>
      <h2>Live Graph</h2>
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        width="100%"
        height="400"
      />
    </>
  );
};

export default LiveGraph;
