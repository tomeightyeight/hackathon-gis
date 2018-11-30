'use strict'

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

import fetch from 'node-fetch'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0 // ignore certificate issues

const geoServerHost = 'http://admin.nelson'

const northAmericaLayerTiled = new TileLayer({
  visible: true,
  source: new TileWMS({
    url: `${geoServerHost}/geoserver/nurc/wms`,
    params: {
      'FORMAT': 'image/png', 
      'VERSION': '1.1.1',
      'tiled': true,
      'LAYERS': 'nurc:Img_Sample',
      'exceptions': 'application/vnd.ogc.se_inimage',
      'tilesOrigin': -130.85168 + ',' + 20.7052
    }
  })
})

const northAmericaLayerUntiled = new ImageLayer({
  source: new ImageWMS({
    ratio: 1,
    url: `${geoServerHost}/geoserver/nurc/wms`,
    params: {
      'FORMAT': 'image/png',
      'VERSION': '1.1.1',  
      'LAYERS': 'nurc:Img_Sample',
      'exceptions': 'application/vnd.ogc.se_inimage',
    }
  })
})

const buildVectorLayer = function (geoJSON) {
  const vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geoJSON)
  })

  return new VectorLayer({
    source: vectorSource,
    style: null // TODO: lets add some styles
  })
}

const fetchGeoJSON = function (uri) {
  return fetch(uri, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(result => result.json())
    .catch(error => {
      console.error(error)
    })
}

document.addEventListener('DOMContentLoaded', async () => {
  const stripProtocol = uri => uri.replace('http://', '')
  const host = stripProtocol(geoServerHost)

  const uri = `http://localhost:3000/${host}/geoserver/tiger/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Agiant_polygon&maxFeatures=50&outputFormat=application%2Fjson`
  const geoJSON = await fetchGeoJSON(uri)
  const vectorLayer = buildVectorLayer(geoJSON)
  
  new Map({
    target: 'map',
    layers: [
      northAmericaLayerTiled,
      // northAmericaLayerUntiled
      vectorLayer
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  })
})
