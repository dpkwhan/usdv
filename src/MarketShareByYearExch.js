import autoBind from "react-autobind";
import numeral from "numeral";
import ChartComponent from "./ChartComponent";

class MarketShareByYearExch extends ChartComponent {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
  }

  makeChartOptions(props) {
    const { legendData, xAxisData, series } = props.data;
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
            const pct = numeral(item.data).format("0.0a");
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
            name: "daily-volume-by-exchange"
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
            return numeral(value).format("0a");
          }
        },
        name: "Shares",
        nameLocation: "center",
        nameGap: 22
      },
      dataZoom: [
        {
          type: "inside",
          start: 85,
          end: 100
        },
        {
          show: true,
          type: "slider",
          top: "95%",
          start: 85,
          end: 100
        }
      ],
      series
    };
  }
}

export default MarketShareByYearExch;
