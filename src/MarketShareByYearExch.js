import autoBind from "react-autobind";
import numeral from "numeral";
import ChartComponent from "./ChartComponent";

class MarketShareByYearExch extends ChartComponent {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
  }

  makeChartOptions(props) {
    const { method, data } = props;
    const { legendData, xAxisData, series } = data;
    const style =
      "display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px";
    const colorSpan = color =>
      `<span style="${style};background-color:${color}"></span>`;

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          animation: true
        },
        formatter: function(params) {
          let rez = `<p style="text-align:left"><b>Date: ${params[0].axisValue}</b></p>`;
          rez += "<table>";
          params.forEach(item => {
            const colorEle = colorSpan(item.color);
            const fmt = method === "mktVolume" ? "0.0a" : "0.0%";
            const pct = numeral(item.data).format(fmt);
            const xx = `<tr><td style="text-align:left">${colorEle} ${item.seriesName}</td><td style="text-align:right;padding-left:5px">${pct}</td></tr>`;
            rez += xx;
          });
          rez += "</table>";
          return rez;
        }
      },
      legend: {
        data: legendData
      },
      toolbox: {
        show: true,
        right: "1%",
        feature: {
          magicType: {
            show: true,
            type: ["line", "bar"],
            title: {
              line: "Line Chart",
              bar: "Bar Chart"
            }
          },
          restore: { show: true, title: "Restore" },
          saveAsImage: {
            show: true,
            title: "Save As Image",
            type: "png",
            name:
              method === "mktVolume"
                ? "daily-volume-by-exchange"
                : "market-share-by-exchange"
          }
        },
        orient: "vertical",
        iconStyle: {
          normal: {
            textPosition: "left",
            textAlign: "right"
          },
          emphasis: {
            textPosition: "left",
            textAlign: "right"
          }
        },
        top: "middle"
      },
      calculable: true,
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: xAxisData
      },
      yAxis: {
        type: "value",
        max: "dataMax",
        axisLabel: {
          formatter: function(value, index) {
            return method === "mktVolume"
              ? numeral(value).format("0a")
              : numeral(value).format("%");
          }
        },
        name: method === "mktVolume" ? "Market Volume" : "Market Share (%)",
        nameLocation: "end",
        nameGap: 22
      },
      dataZoom: [
        {
          type: "inside",
          start: 97,
          end: 100
        },
        {
          show: true,
          type: "slider",
          top: "95%",
          start: 97,
          end: 100
        }
      ],
      series
    };
  }
}

export default MarketShareByYearExch;
