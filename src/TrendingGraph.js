import React from 'react'
import * as d3 from 'd3'
import { filter, isUndefined, maxBy, size, sortBy, toPairs } from 'lodash'

import SvgLoadingAnimation from './utils/SvgLoadingAnimation'

import './style/TrendingGraph.scss'

const hourParseTime = d3.timeParse("%Y-%m-%d %H")
const dayParseTime = d3.timeParse("%Y-%m-%d")

const TRIM_LENGTH = 2


export default class TrendingGraph extends React.Component {
  static propTypes = {
    /**
     * Dictionary of dates and values
     */
    data: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static defaultProps = {
    width: 200,
    height: 50
  }

  render() {
    const width = this.props.width
    const height = this.props.height
    
    let path = <SvgLoadingAnimation width={width} height={height}/>
    
    if (this.props.data) {
      let data = sortBy(filter(toPairs(this.props.data), (val, key) => {
                  return !isUndefined(val) && val.length == 2
                 }), 0)
                 .slice(TRIM_LENGTH, -TRIM_LENGTH)

      const maxValue = (maxBy(data, (e) => e[1])||[])[1]

      const parseTime = (dt) => (hourParseTime(dt)||dayParseTime(dt))
      
      const xAxis = d3.scaleTime()
                      .rangeRound([0, width])
                      .domain(d3.extent(data, (d) => parseTime(d[0])))
                      
      const yAxis = d3.scaleLinear()
                      .rangeRound([height*0.95, height*0.05])
                      .domain([0, maxValue])
                      
      const getLine = d3.line().x(d => xAxis(parseTime(d[0])))
                      .y(d => yAxis(d[1]))
                      
      const d = getLine(data)
      
      path = <path d={d} fill="none"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         className="trending_graph__line"/>
    }

    return <svg className="trending_graph" viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
            {path}
          </svg>
  }
}
