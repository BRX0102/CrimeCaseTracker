/**
 * Created by Red-8 on 4/7/2017.
 */
/* global Plotly */
// Plot.js
import React, { Component } from 'react';
import { getAllFromTable, getCasesByYear } from '../../../public/fetchDB';
import {LineChart, Bar, RadialBar, RadialBarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart} from 'Recharts';
import { DropdownButton, MenuItem } from 'react-bootstrap'

const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
const SimpleBarChart = React.createClass({
  getInitialState() {
    return {
      data: this.props.data,
      plot: []
    };
  },
  componentWillReceiveProps(newProps) {
    this.setState({data: newProps.data});
    this.processData(newProps.data);
  },
  processData(newData){
    var data = newData;
    var count = {};
    var tempPlot = [];
    var obj = {};

    for (var i in data) {
      count[data[i]] = (count[data[i]] || 0) + 1;
    }
    for (var key in count) {
      if ((this.props.legend == "words" && count[key] > 2)
          || this.props.legend != "words" && count[key] > 1){
        obj["name"] = key;
        obj[this.props.legend] = count[key];
        tempPlot.push(obj);
        obj = {};
      }
    }
    this.setState({plot: tempPlot});
  },
  render () {
    return (
      <BarChart width={800} height={250} data={this.state.plot}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis mirror={true} dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Legend/>
        <Tooltip/>
        <Bar dataKey={this.props.legend} fill={this.props.color} />
      </BarChart>
    );
  }
})

export default class GenerateReports extends Component{
  constructor() {
    super()
    this.state = {
      cases:[],
      crimes: [],
      units: [],
      statuses: [],
      summary: [],
      year: "Year"
    }
  }
  cleanString(str){
    var common = ["with", "were", "suspect", "victim", "when", "into"];
    var commonStr = new RegExp(common.join("|"),"g");

    str = str.replace(/[.,\'`~()]/g,"");
    str = str.replace(commonStr,'');

    return str;

  }
  handleSelect(e){
     console.log(e);
     this.setState({year: e});
     this.loadFromServer();
  }
  loadFromServer(){
    getAllFromTable('Casetrack').then((cases) => {
      var words = [];
      var str = ""
      this.state.units = [];
      this.state.crimes = [];
      for (var i in cases){
        if (cases[i]['Entry Date'].slice(-4) == this.state.year){
          this.state.crimes.push(cases[i].Crime.toUpperCase());
          this.state.units.push(cases[i].Unit.toUpperCase());
          this.state.statuses.push(cases[i].Status.toUpperCase());

          str = this.cleanString(cases[i].Comments.toLowerCase());
          str = str.split(" ");
          for (var j in str){
            if (str[j].length > 3){
              words.push(str[j]);
            }
          }
        }
      }


      this.setState({cases: cases,
                    units: this.state.units,
                    crimes: this.state.crimes,
                    statuses: this.state.statuses,
                    summary: words});
      console.log("crimes");
      console.log(this.state.crimes);
      // console.log("summary");
      // console.log(this.state.summary);
    });
  }
  componentDidMount(){
    this.loadFromServer();
  }
  render(){
    return(
      <div id="myDiv">
        <div style={{"textAlign":"right"}}>
          <DropdownButton onSelect={(e) => this.handleSelect(e)}
                          style={{"marginRight": "150px",
                                  "marginTop": "15px"}}
                          bsStyle={"primary"}
                          title={this.state.year}  >
            <MenuItem eventKey="2010">2010</MenuItem>
            <MenuItem eventKey="2011">2011</MenuItem>
            <MenuItem eventKey="2012">2012</MenuItem>
            <MenuItem eventKey="2013">2013</MenuItem>
            <MenuItem eventKey="2014">2014</MenuItem>
          </DropdownButton>
        </div>
        <div style={{"margin": "20px"}}>
          <div ><SimpleBarChart color={colors[0]} legend="crime" data={this.state.crimes}/></div>
          <div ><SimpleBarChart color={colors[1]} legend="unit" data={this.state.units}/></div>
          <div ><SimpleBarChart color={colors[2]} legend="status" data={this.state.statuses}/></div>
          <div ><SimpleBarChart color={colors[3]} legend="words" data={this.state.summary}/></div>
        </div>
      </div>
    );
  }
}

const data3 = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const SimpleLineChart = React.createClass({
  render () {
    return (
      <LineChart width={400} height={200} data={data3}
                 margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    );
  }
})

const SimpleRadialBarChart = React.createClass({
  getInitialState() {
    return {
      data: [],
      plot: []
    };
  },
  componentWillReceiveProps(newProps) {
    this.processData();
  },
  processData(){
    var data = this.props.data;
    var count = {};
    var tempPlot = [];
    var obj = {};
    var color = 0;

    for (var i in data) {
      count[data[i]] = (count[data[i]] || 0) + 1;
    }
    for (var key in count) {
      obj["name"] = key;
      obj["count"] = count[key];
      obj["fill"] = colors[color];
      color += 1;
      tempPlot.push(obj);
      obj = {};
    }

    this.setState({plot: tempPlot});

  },
  render () {
    return (
      <RadialBarChart width={800} height={400} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10} data={this.state.plot}>
        <RadialBar minAngle={15} label background clockWise={true} dataKey='count'/>
        <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
      </RadialBarChart>
    );
  }
})

/// who | were | her | his | but | while | him | over | tlk | when | the | be | are | to | are | no | of | and | a | in | that | have | i | it | for | not | on | with /g
