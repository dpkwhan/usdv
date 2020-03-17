import React, { Component } from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import echarts from "echarts";
import isEqual from "lodash/isEqual";
import macarons from "./macarons";

class ChartComponent extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
  }

  createChart(props) {
    this.chart = echarts.init(ReactDOM.findDOMNode(this), "macarons");
    if (!props) {
      return null;
    }
    const options = this.makeChartOptions(props);
    this.chart.setOption(options);
  }

  makeChartOptions(props) {
    throw Error("Please implement this function");
  }

  resizeContainer() {
    const node = ReactDOM.findDOMNode(this);
    const { height } = node.getBoundingClientRect();
    node.style.height = height;
    this.props.onResize(height);
  }

  componentDidMount() {
    echarts.registerTheme("macarons", macarons);
    this.resizeContainer();
    this.createChart(this.props);
    window.onresize = () => {
      this.resizeContainer();
      this.chart.resize();
    };
    setTimeout(
      function() {
        this.resizeContainer();
      }.bind(this),
      500
    );
  }

  componentWillUnmount() {
    this.chart.dispose();
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.chart.dispose();
      this.createChart(this.props);
    }
    return null;
  }

  render() {
    return <div style={{ height: "70vh", width: "100%" }} />;
  }
}

ChartComponent.propTypes = {
  data: PropTypes.object,
  onResize: PropTypes.func
};

export default ChartComponent;
