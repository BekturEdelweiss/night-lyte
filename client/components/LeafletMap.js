import React from 'react'
import queryString from 'query-string'
import {Map, TileLayer, Popup, Circle} from 'react-leaflet'
import Routing from './RoutingMachine'
import {getBusinessesFromApi} from '../store/businesses'
import {connect} from 'react-redux'

class LeafletMap extends React.Component {
  state = {
    lat: 40.7831,
    lng: -73.9749,
    zoom: 11,
    isMapInit: false,
    address: '',
    hourToRender: 1612270800
  }

  async componentDidMount() {
    try {
      let decodedUrl = await queryString.parse(location.search)

      await this.props.getBusinessesFromApi(
        decodedUrl.start,
        this.state.hourToRender
      )
      this.setState({
        start: decodedUrl.start,
        destination: decodedUrl.destination
      })
      console.log('state', this.state)
    } catch (error) {
      console.log(error)
    }
  }

  saveMap = map => {
    this.map = map
    this.setState({
      isMapInit: true
    })
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    console.log(position)
    return (
      <Map center={position} zoom={this.state.zoom} ref={this.saveMap}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/kamalt/ckkoarmdr0uxx17qq5qysvnnl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtYWx0IiwiYSI6ImNra2tpc2NsdjBjZmcycG9jY21qYWF4MncifQ.Ri_912i2-6xSua8DSQZnZA"
          attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
        />
        {this.state.isMapInit && (
          <Routing
            map={this.map}
            start={this.start}
            destination={this.destination}
          />
        )}
        {this.props.businesses.map(business => {
          return (
            <Circle
              key={business.id}
              center={[
                business.coordinates.latitude,
                business.coordinates.longitude
              ]}
              radius={18}
              stroke={false}
              // color="#E9C37B"
              fill={true}
              fillColor="#E9C37B"
              fillOpacity={0.8}
            >
              <Popup>{business.name}</Popup>
            </Circle>
          )
        })}
      </Map>
    )
  }
}

const mapState = state => {
  return {
    businesses: state.businesses
  }
}

const mapDispatch = dispatch => {
  return {
    getBusinessesFromApi: (inputAddress, hour) =>
      dispatch(getBusinessesFromApi(inputAddress, hour))
  }
}
export default connect(mapState, mapDispatch)(LeafletMap)