import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

export class WorldMap extends Component {
  state = {
    worldData: []
  }
  projection () {
    return geoMercator()
      .scale(100)
      .translate([ 800/2, 450/2 ])
  }

  componentDidMount(){
    fetch('/world-110m.json')
      .then(response => {
        if (response.status !== 200){
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worldData => {
          console.log('hello', worldData.objects.countries)
          this.setState({
            worldData: feature(worldData, worldData.objects.countries).features
          })
        })
      })
  }

  render () {
    return (
      <svg width={800} height={450} viewBox='0 0 800 450'>
        <g className='countries'>
          {
            this.state.worldData.map((d, i) => (
              <path key={`path=${i}`}
                    d={ geoPath().projection(this.projection())(d) }
                    className='country'
                    fill={ `rgba(38,50,56,${1 / this.state.worldData.length * i})` }
                    stroke='#FFFFF'
                    strokeWidth={0.5}
              />
            ))
          }
        </g>
      </svg>
    )
  }
}
