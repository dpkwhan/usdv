import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import { Row, Col, Radio } from "antd";
import MarketShareByYearExch from "./MarketShareByYearExch";
import marketShareByYearExch from "./dailyVolumeByExch.json";

class MarketShareByYearExchWithData extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.exchangeGroups = this.getExchangeGroups();
    this.state = {
      groupName: "all",
      chartData: this.filterData("all"),
      height: 300
    };
  }

  isInGroup(exch, groupName) {
    if (groupName === "all") return true;
    const groupMembers = this.exchangeGroups[groupName].venues;
    return groupMembers.includes(exch);
  }

  getExchangeGroups() {
    return {
      all: {},
      cboe: {
        venues: ["CBOE", "CBOE BYX", "CBOE BZX", "CBOE EDGA", "CBOE EDGX"]
      },
      nasdaq: {
        venues: ["NASDAQ", "NASDAQ BX", "NASDAQ ISE", "NASDAQ PSX"]
      },
      nyse: {
        venues: [
          "NYSE",
          "NYSE American",
          "NYSE Arca",
          "NYSE Chicago",
          "NYSE National"
        ]
      },
      inverted: {
        venues: ["CBOE BYX", "CBOE EDGA", "NASDAQ BX", "NYSE National"]
      },
      iex: { venues: ["IEX"] },
      trf: { venues: ["TRF"] }
    };
  }

  onGroupSelection(e) {
    const groupName = e.target.value;
    this.setState({ groupName, chartData: this.filterData(groupName) });
  }

  filterData(groupName) {
    const chartData = {
      xAxisData: marketShareByYearExch.date,
      legendData: [],
      series: []
    };
    let processedData = {};
    if (groupName === "all") {
      Object.keys(marketShareByYearExch).forEach(key => {
        if (key === "date") return;
        const exchData = marketShareByYearExch[key];
        const name = key.split(" ")[0];
        if (processedData.hasOwnProperty(name)) {
          exchData.forEach(function(v, i) {
            processedData[name][i] += v;
          });
        } else {
          // Make sure to clone the array
          processedData[name] = exchData.slice(0);
        }
      });
    } else {
      processedData = marketShareByYearExch;
    }

    Object.keys(processedData).forEach(key => {
      if (key === "date") return;
      const name = key;
      if (this.isInGroup(name, groupName)) {
        const dataPoints = {
          name,
          type: "bar",
          barMaxWidth: 50,
          stack: "dailyVolume",
          symbol: "none",
          itemStyle: { normal: { areaStyle: { type: "default" } } },
          data: processedData[name]
        };
        if (groupName === "inverted" && name === "NYSE National") {
          marketShareByYearExch.date.forEach(function(date, i) {
            if (date <= 2017) {
              dataPoints.data[i] = 0;
            }
          });
        }
        chartData.legendData.push(name);
        chartData.series.push(dataPoints);
      }
    });
    return chartData;
  }

  onResize(height) {
    this.setState({ height });
  }

  render() {
    const { groupName, chartData } = this.state;
    const leftColumnWidth = 24;

    return (
      <Fragment>
        <Row gutter={32}>
          <Col span={leftColumnWidth}>
            <div align="right">
              <Radio.Group onChange={this.onGroupSelection} value={groupName}>
                <Radio value="all">All</Radio>
                <Radio value="cboe">CBOE</Radio>
                <Radio value="nasdaq">NASDAQ</Radio>
                <Radio value="nyse">NYSE</Radio>
                <Radio value="inverted">Inverted</Radio>
                <Radio value="iex">IEX</Radio>
                <Radio value="trf">Off-Exchange</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={leftColumnWidth}>
            <MarketShareByYearExch data={chartData} onResize={this.onResize} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default MarketShareByYearExchWithData;
