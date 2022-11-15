const mapboxgl = require('mapbox-gl');
const coverageJson = require('./coverage.json');
const geoViewport = require('@mapbox/geo-viewport');
const d3 = require('d3');

let data = {};

// Load default selection from URL
const urlParams = new URLSearchParams(window.location.search);

// Detect starting country from user location if not explicitly defined
if (urlParams.get('country') == null) {
  detectUserLocation();
}

//  Setup mapbox

mapboxgl.accessToken =
  'pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRyajE3bm8zY3RrNGg0OHpleXgifQ.cxv1weitIG8VRtTIQr_Czg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-99.9, 41.5],
  zoom: 0,
  hash: true,
  bearingSnap: 0,
});

/* eslint-disable */
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  }),
  'top-right'
);

// Add zoom and rotation controls to the map.
map.addControl(
  new mapboxgl.NavigationControl({ visualizePitch: true }),
  'top-right'
);
/* eslint-enable */

function AppConfig() {
  this.country = urlParams.get('country') || 'US';
  this.layer = urlParams.get('layer') || 'adm1';
  this.worldview = urlParams.get('worldview') || 'US';
}
const appConfig = new AppConfig();

// GLOBALS
const selectCountryEl = document.getElementById('selectCountry');
let selectLevelEl = document.getElementById('selectLevel');
const selectWorldviewEl = document.getElementById('selectWorldview');
const loadingbar = document.getElementById('loading');
let polyLayerName, countryChange, levelChange, z_min, bounds;

let country_filter = appConfig['country'];
let level = appConfig['layer'];
let worldview = appConfig['worldview'];

let lookup_url =
  './lib/lookups/' + country_filter + '/' + level + '.json?v=4.0';

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: {
    top: [0, 10],
    bottom: [0, -10],
  },
});

let popupevent, clickevent, featureFilter, country_hovered;

// Insert flags in the country list
document.querySelectorAll('#selectCountry option').forEach(element => {
  element.insertAdjacentHTML(
    'beforeend',
    ' <span style="float:right">' + getFlagEmoji(element.value) + '</span>'
  );
});

// Create the dropdown of boundary type and levels for selected country
function createLevelDropdown() {
  let currentType;
  const types = {
    adm: 'Administrative',
    loc: 'Locality',
    leg: 'Legislative',
    pos: 'Postal',
    sta: 'Statistical',
  };
  Object.keys(coverageJson[country_filter])
    .sort()
    .forEach(key => {
      if (key === 'bbox' || key === 'mapbox_id') {
        return;
      }
      // Add a seperator option for each type
      if (key.substr(0, 3) !== currentType) {
        currentType = key.substr(0, 3);
        const optionSeperator = document.createElement('option');
        optionSeperator.text = types[currentType];
        optionSeperator.disabled = true;
        optionSeperator.value = key;
        selectLevelEl.add(optionSeperator);
      }
      const option = document.createElement('option');
      option.text =
        key + ' : ' + coverageJson[country_filter][key]['description'];
      option.value = key;
      selectLevelEl.add(option);
    });

  document.getElementById('selectLevel').value = coverageJson[
    country_filter
  ].hasOwnProperty(level)
    ? level
    : coverageJson[country_filter].hasOwnProperty('adm1')
    ? 'adm1'
    : 'adm0';
}

createLevelDropdown();

// Update dropdown selection
document.getElementById('selectLevel').value = level || 'adm1';
document.getElementById('selectCountry').value = country_filter;
document.getElementById('selectWorldview').value = worldview;

// Update level dropdown when country changes
document.getElementById('selectCountry').addEventListener('change', e => {
  country_filter = e.target.value;

  selectLevelEl.remove();

  const select = document.createElement('select');
  select.setAttribute('class', 'select select--stroke select--stroke-darken75');
  select.setAttribute('id', 'selectLevel');
  document.getElementById('selectLevelContainer').appendChild(select);
  selectLevelEl = document.getElementById('selectLevel');

  selectLevelEl.addEventListener('change', () => {
    levelChange = true;
    updateMap();
  });

  createLevelDropdown();
});

// ////// MAIN FUNCTIONS /////////////

function updateMap() {
  // Update URL params
  urlParams.set('country', document.getElementById('selectCountry').value);
  urlParams.set('layer', document.getElementById('selectLevel').value);
  urlParams.set('worldview', document.getElementById('selectWorldview').value);
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${urlParams}${location.hash}`
  );

  loadingbar.style.visibility = 'visible';
  popup.remove();
  popup.addTo(map);
  const newlevel = document.getElementById('selectLevel').value;
  const style = map.getStyle();

  // Remove interactivity events while swapping layers and sources
  map.off('mousemove', popupevent);
  map.off('click', clickevent);
  popup.remove();

  // Remove existing sources and layers if the admin level has changed
  // Do not remove adm0 as it is used as a base for all views

  if (newlevel !== level && level !== 'adm0') {
    style.layers.forEach(layer => {
      if (layer.id.search(level) > -1) {
        map.removeLayer(layer.id);
      }
    });

    for (const key in style.sources) {
      if (key.search(level) > -1) {
        map.removeSource(key);
      }
    }
  }

  // Remove point tileset if type has changed
  const type = level.slice(0, -1);
  if (newlevel.slice(0, -1) !== type) {
    for (const key in style.sources) {
      if (key.search(type + 'Points') > -1) {
        map.removeSource(type + 'Points');
      }
    }
  }

  country_filter = document.getElementById('selectCountry').value;
  level = newlevel;
  lookup_url = './lib/lookups/' + country_filter + '/' + level + '.json';

  // Use a map projection based on the country selected
  // https://projectionwizard.org/
  switch (country_filter) {
    case 'RU':
      map.setProjection({
        name: 'mercator',
      });
      map.setBearing(0);
      break;
    default:
      map.setProjection({
        name: 'globe',
      });
      map.setBearing(0);
  }

  getData(lookup_url, initmap, initLayers);
}

map.on('style.load', () => {
  // What to run on the first map load

  // Set the default atmosphere style
  map.setFog({
    range: [0, 2],
    'horizon-blend': 0.3,
    color: 'grey',
    'high-color': '#add8e6',
    'space-color': 'black',
    'star-intensity': 0.0,
  });

  updateMap();

  // Add event listeners to update the view when the selection dropdowns change
  selectLevelEl.addEventListener('change', () => {
    levelChange = true;
    updateMap();
  });

  selectWorldviewEl.addEventListener('change', () => {
    updateMap();
  });

  selectCountryEl.addEventListener('change', () => {
    countryChange = true;
    updateMap();
  });

  // Collect layer ids that can be used to change country on click
  const countryLayers = findLayers(map, layer => {
    return (
      layer['source-layer'] === 'country_label' || layer.id === 'country-label'
    );
  }).map(layer => layer.id);
  countryLayers.push('adm0');

  // Highlight adm0 of hovered country
  map.on('mousemove', 'adm0', e => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: countryLayers,
    });

    if (features.length) {
      map.getCanvasContainer().style.cursor = 'pointer';
      if (
        country_hovered &&
        country_hovered !== features[0].properties.iso_3166_1
      ) {
        map.setFeatureState(
          {
            source: 'adm0',
            sourceLayer: 'boundaries_admin_0',
            id: coverageJson[country_hovered].mapbox_id,
          },
          {
            hover: 0,
          }
        );
      }

      country_hovered = features[0].properties.iso_3166_1;

      map.setFeatureState(
        {
          source: 'adm0',
          sourceLayer: 'boundaries_admin_0',
          id: coverageJson[country_hovered].mapbox_id,
        },
        {
          hover: 1,
        }
      );
    } else {
      map.getCanvasContainer().style.cursor = '';
      map.setFeatureState(
        {
          source: 'adm0',
          sourceLayer: 'boundaries_admin_0',
          id: coverageJson[country_hovered].mapbox_id,
        },
        {
          hover: 0,
        }
      );
    }
  });

  // Reset on losing focus
  map.on('mouseout', 'adm0', () => {
    map.setFeatureState(
      {
        source: 'adm0',
        sourceLayer: 'boundaries_admin_0',
        id: coverageJson[country_hovered].mapbox_id,
      },
      {
        hover: 0,
      }
    );
  });

  // Select country by clicking on country labels
  map.on('click', e => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: countryLayers,
    });

    // Trigger map update if a different country label was clicked
    if (
      features.length &&
      'iso_3166_1' in features[0].properties &&
      features[0].properties.iso_3166_1 !==
        document.getElementById('selectCountry').value
    ) {
      selectCountry(features[0].properties.iso_3166_1);
    }
  });
});

// //////// HELPER METHODS ////////////

function getData(url, initMapCb, initLayersCb) {
  fetch(url)
    .then(resp => {
      return resp.json();
    })
    .then(lookup_data => {
      initMapCb(lookup_data, level);
      initLayersCb(level);
    });
}

function setBboxFeatures() {
  bounds = JSON.parse(coverageJson[country_filter]['bbox']);
  z_min = parseInt(coverageJson[country_filter][level]['z_min']);

  try {
    const viewport = geoViewport.viewport(
      bounds,
      [window.innerWidth, window.innerHeight],
      0,
      12,
      512
    );

    // Set autozoom level to be greater than layer z_min
    viewport.zoom = Math.max(viewport.zoom, z_min + 1);

    // Viewport overrides
    // Adjust to continental US
    if (country_filter === 'US') {
      viewport.center = [-100, 41];

      // viewport.zoom = 3.3;
    }

    if (country_filter === 'CA') {
      viewport.center = [-97, 63];
      viewport.zoom = 3.6;
    }

    // CA postal
    if (
      country_filter === 'CA' &&
      document.getElementById('selectLevel').value === 'pos4'
    ) {
      viewport.center = [-79.38656, 43.64865];
      viewport.zoom = 13;
    }

    // change zoom if we change countries, or if there's a new level selected _and_
    // that level isn't visible at our current zoom
    const changeZoom =
      countryChange ||
      (levelChange && z_min > map.getZoom()) ||
      map.getZoom() < 2;

    if (changeZoom) {
      map.easeTo({
        center: viewport.center,
        zoom: viewport.zoom - 0.5,
      });
    }

    // reset change variable after updating the map
    levelChange = false;
    countryChange = false;
  } catch (e) {
    console.log(e);
  }
}

function addPopupHover(popuplayer) {
  // Add a popup to the map
  let id = '0';

  popupevent = function (e) {
    if (!map.getLayer(popuplayer)) {
      return;
    }

    // Pause popups if cmd is pressed
    if (e.originalEvent.metaKey) {
      return;
    }

    const features = map.queryRenderedFeatures(e.point, {
      layers: [popuplayer],
    });

    // map.getCanvas().style.cursor = features.length ? "pointer" : "";
    if (!features.length) {
      popup.remove();
      map.setFeatureState(
        {
          source: level + 'join',
          sourceLayer: polyLayerName,
          id: id,
        },
        {
          hover: 0,
        }
      );
      id = '0';
      return;
    }

    const feature = features[0];
    const newid = feature.id;

    if (id !== newid) {
      // Set the pk of the polygon to the newly hovered pk
      map.setFeatureState(
        {
          source: level + 'join',
          sourceLayer: polyLayerName,
          id: id,
        },
        {
          hover: 0,
        }
      );
      id = newid;

      // Create the tooltip
      const featureid = feature.id;
      const featureLookupData = Object.entries(data).length
        ? data[featureid]
        : null;

      const name =
        featureLookupData && featureLookupData.hasOwnProperty('name')
          ? featureLookupData.name
          : null;
      const name_en =
        featureLookupData && featureLookupData.hasOwnProperty('name_en')
          ? featureLookupData.name_en
          : null;
      const code =
        featureLookupData && featureLookupData.hasOwnProperty('code')
          ? featureLookupData.code
          : '';
      const wikidata_id =
        featureLookupData && featureLookupData.hasOwnProperty('wikidata_id')
          ? featureLookupData.wikidata_id
          : '';

      const outerDiv = document.createElement('div');

      outerDiv.setAttribute(
        'class',
        'flex-parent-inline flex-parent--center-cross flex-parent--column py2 px2'
      );

      const div1 = document.createElement('div');
      div1.setAttribute('class', 'txt-h4 py2 px2 txt-bold');
      const div1Text = document.createTextNode(
        `${name ? name : ''} ${name_en ? '/ ' + name_en : ''}`
      );
      div1.appendChild(div1Text);
      outerDiv.appendChild(div1);

      const div2 = document.createElement('div');
      div2.setAttribute('class', 'txt-h5 py6 px6 mt3');

      if (code !== '') {
        const div2Text = document.createTextNode(`Code `);
        div2.appendChild(div2Text);
        outerDiv.appendChild(div2);
        const span1 = document.createElement('span');
        span1.setAttribute('class', 'txt-bold txt-kbd py6 px6');
        const span1Text = document.createTextNode(`${code}`);
        span1.appendChild(span1Text);
        div2.appendChild(span1);
      }

      if (wikidata_id) {
        const a = document.createElement('a');
        a.setAttribute('class', 'px3');
        a.href = 'https://www.wikidata.org/wiki/' + wikidata_id;
        a.innerHTML =
          "<img class='mt-neg6' height=30 src='https://upload.wikimedia.org/wikipedia/commons/8/8f/W-circle.svg'>";
        div2.appendChild(a);

        const div3 = document.createElement('div');
        outerDiv.appendChild(div3);

        // Load content from WIkipedia after 1 second
        setTimeout(
          fetchArticleFromWikidata,
          1000,
          wikidata_id,
          'en',
          (wikidataJSON, wikipediaJSON) => {
            const wikipediaUrl = window.mobileCheck()
              ? wikipediaJSON.content_urls.mobile.page
              : wikipediaJSON.content_urls.desktop.page;
            div3.innerHTML = `<div class='prose txt-s' style='overflow: hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:8;-webkit-box-orient:vertical;'>${wikipediaJSON.extract_html}</div><div><span class='txt-xs'>from <a class='link' href='${wikipediaUrl}'>Wikipedia</a></div>`;
          }
        );
      }

      popup.setDOMContent(outerDiv).addTo(map);
    }

    map.setFeatureState(
      {
        source: level + 'join',
        sourceLayer: polyLayerName,
        id: id,
      },
      {
        hover: 1,
      }
    );
    popup.setLngLat(e.lngLat).addTo(map);
  };

  // Reset hover and popups on losing mouse focus
  map.on('mouseout', level + 'join', () => {
    map.setFeatureState(
      {
        source: level + 'join',
        sourceLayer: polyLayerName,
        id: id,
      },
      {
        hover: 0,
      }
    );
    popup.remove();
  });

  map.on('mousemove', popupevent);
}

function addSelectClick(queryLayer) {
  // When the user clicks the map, set the main fill layer opacity low
  // To indicate 'selection mode'.  As the user clicks on polygons in the map,
  // highlight the polygons and store their pk's in a Map() to use in other
  // dashboard filter elements.

  let listOfPksToSelect = new Map();

  clickevent = function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [queryLayer],
    });
    let id = 0;

    if (!features.length) {
      // Reset the highlightLayer if there are no features selected
      listOfPksToSelect.forEach(value => {
        map.setFeatureState(
          {
            source: level + 'join',
            sourceLayer: polyLayerName,
            id: value,
          },
          {
            select: 0,
          }
        );
      });
      id = 0;
      listOfPksToSelect = new Map();
      map.setPaintProperty(queryLayer, 'fill-opacity', 1);
      return;
    }

    // Get the pk property from the selected feature
    const feature = features[0];
    id = feature.id;

    // Add or remove the clicked feature's pk to the filter list
    if (listOfPksToSelect.get(id)) {
      listOfPksToSelect.delete(id);
      map.setFeatureState(
        {
          source: level + 'join',
          sourceLayer: polyLayerName,
          id: id,
        },
        {
          select: 0,
        }
      );
    } else {
      listOfPksToSelect.set(id, id);
    }

    // Set the style based on the current features selected
    if (listOfPksToSelect.size > 0) {
      map.setPaintProperty(queryLayer, 'fill-opacity', 0.5);
      listOfPksToSelect.forEach(value => {
        map.setFeatureState(
          {
            source: level + 'join',
            sourceLayer: polyLayerName,
            id: value,
          },
          {
            select: 1,
          }
        );
      });
    } else {
      map.setPaintProperty(queryLayer, 'fill-opacity', 1);
      map.setFeatureState(
        {
          source: level + 'join',
          sourceLayer: polyLayerName,
          id: id,
        },
        {
          select: 0,
        }
      );
    }
  };

  map.on('click', queryLayer, clickevent);
}

function initLayers(level) {
  // Find the appropriate location to insert overlay layers, ideally before any label layers
  const styleLabelLayers = findLayers(map, layer => {
    return (
      layer.hasOwnProperty('layout') && layer.layout.hasOwnProperty('text-font')
    );
  });
  const insertBeforeLayer = styleLabelLayers ? styleLabelLayers[0].id : null;

  // Dim labels for countries not selected
  styleLabelLayers.forEach(layer => {
    if (layer.id === 'country-label') {
      map.setPaintProperty(layer.id, 'text-opacity', [
        'case',
        ['==', ['get', 'iso_3166_1'], country_filter],
        0.9,
        0.7,
      ]);
    } else {
      map.setPaintProperty(layer.id, 'text-opacity', [
        'case',
        ['==', ['get', 'iso_3166_1'], country_filter],
        0.9,
        0.5,
      ]);
      map.setPaintProperty(layer.id, 'icon-opacity', [
        'case',
        ['==', ['get', 'iso_3166_1'], country_filter],
        0.7,
        0.1,
      ]);
    }
  });

  // Add base admin-0 polygons and lines
  if (!map.getSource('admLines')) {
    // Remove default boundaries from mapbox-streets tilesets
    findLayers(map, layer => {
      return layer['source-layer'] === 'water';
    })
      .map(layer => layer.id)
      .forEach(layer => map.setPaintProperty(layer, 'fill-color', '#f0faff'));

    // Remove default boundaries from mapbox-streets tilesets
    findLayers(map, layer => {
      return layer['source-layer'] === 'admin';
    })
      .map(layer => layer.id)
      .forEach(layer => map.removeLayer(layer));

    // Add boundaries from boundaries tilesets
    map.addSource('admLines', {
      type: 'vector',
      url: 'mapbox://mapbox.boundaries-admLines-v4',
      promoteId: 'mapbox_id',
    });

    map.addSource('adm0', {
      type: 'vector',
      url: 'mapbox://mapbox.boundaries-adm0-v4',
      promoteId: 'mapbox_id',
    });

    // Add country outlines for mouse interaction

    // Admin-0 outline
    map.addLayer(
      {
        id: 'adm0-outline',
        type: 'line',
        source: 'adm0',
        'source-layer': 'boundaries_admin_0',
        layout: {},
        paint: {
          'line-width': 2,
        },
      },
      insertBeforeLayer
    );

    // Admin-0 polygons
    map.addLayer(
      {
        id: 'adm0',
        type: 'fill',
        source: 'adm0',
        'source-layer': 'boundaries_admin_0',
        layout: {},
        paint: {
          'fill-opacity': 1,
        },
      },
      'water'
    );

    // Replace default admin-0/1 lines from mapbox-streets with boundaries

    // Admin-0 boundaries background
    map.addLayer(
      {
        id: 'admLines-0-bg',
        type: 'line',
        source: 'admLines',
        'source-layer': 'boundaries_admin_lines',
        layout: {},
        paint: {
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0, 4, 0.5],
          'line-color': '#d6d6d6',
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 3.5, 10, 8],
          'line-blur': ['interpolate', ['linear'], ['zoom'], 3, 0, 10, 2],
        },
      },
      insertBeforeLayer
    );

    // Admin-1 boundaries background
    map.addLayer(
      {
        id: 'admLines-1-bg',
        type: 'line',
        source: 'admLines',
        'source-layer': 'boundaries_admin_lines',
        layout: {},
        paint: {
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0, 8, 0.75],
          'line-color': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8,
            'hsl(185, 0%, 84%)',
            16,
            'hsl(185, 0%, 84%)',
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 3.75, 12, 5.5],
          'line-dasharray': [1, 0],
          'line-blur': ['interpolate', ['linear'], ['zoom'], 3, 0, 8, 3],
        },
      },
      insertBeforeLayer
    );

    // Admin-0 boundaries
    map.addLayer(
      {
        id: 'admLines-0',
        type: 'line',
        source: 'admLines',
        'source-layer': 'boundaries_admin_lines',
        layout: {},
        paint: {
          'line-color': '#ababab',
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 10, 2],
          'line-dasharray': [10, 0],
        },
      },
      insertBeforeLayer
    );

    // // Admin-0 disputed boundaries
    map.addLayer(
      {
        id: 'admLines-0-disputed',
        type: 'line',
        source: 'admLines',
        'source-layer': 'boundaries_admin_lines',
        layout: {},
        paint: {
          'line-color': '#ababab',
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 10, 2],
          'line-dasharray': [
            'step',
            ['zoom'],
            ['literal', [3.25, 3.25]],
            6,
            ['literal', [2.5, 2.5]],
            7,
            ['literal', [2, 2.25]],
            8,
            ['literal', [1.75, 2]],
          ],
        },
      },
      insertBeforeLayer
    );

    // Admin-1 boundaries
    map.addLayer(
      {
        id: 'admLines-1',
        type: 'line',
        source: 'admLines',
        'source-layer': 'boundaries_admin_lines',
        layout: {},
        paint: {
          'line-color': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3,
            'hsl(185, 0%, 83%)',
            7,
            'hsl(185, 3%, 68%)',
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.75, 12, 1.5],
          'line-dasharray': [
            'step',
            ['zoom'],
            ['literal', [2, 0]],
            7,
            ['literal', [2, 2, 6, 2]],
          ],
        },
      },
      insertBeforeLayer
    );
  }

  map.setPaintProperty('adm0', 'fill-color', [
    'case',
    ['==', ['get', 'iso_3166_1'], country_filter],
    'hsla(0,0,100%,0.8)',
    ['==', ['feature-state', 'hover'], 1],
    'hsla(0,0,100%,0.5)',
    'hsla(0,0,90%,0.1)',
  ]);

  map.setPaintProperty('adm0-outline', 'line-color', [
    'case',
    ['==', ['get', 'iso_3166_1'], country_filter],
    'hsla(0,0,80%,1)',
    ['==', ['feature-state', 'hover'], 1],
    'hsla(0,0,20%,0.4)',
    'hsla(0,0,20%,0.1)',
  ]);

  // Update the worldview filter in the added layers
  map.setFilter('adm0', [
    'all',
    ['!', ['has', 'dispute']],
    wvFilter(worldview),
  ]);
  map.setFilter('adm0-outline', [
    'all',
    ['!', ['has', 'dispute']],
    wvFilter(worldview),
  ]);
  map.setFilter('admLines-0-bg', [
    'all',
    ['==', ['get', 'level'], 0],
    wvFilter(worldview),
  ]);
  map.setFilter('admLines-1-bg', [
    'all',
    ['==', ['get', 'level'], 1],
    wvFilter(worldview),
  ]);
  map.setFilter('admLines-0', [
    'all',
    ['==', ['get', 'level'], 0],
    ['==', ['get', 'dispute'], 'false'],
    wvFilter(worldview),
  ]);
  map.setFilter('admLines-0-disputed', [
    'all',
    ['==', ['get', 'level'], 0],
    ['==', ['get', 'dispute'], 'true'],
    wvFilter(worldview),
  ]);
  map.setFilter('admLines-1', [
    'all',
    ['==', ['get', 'level'], 1],
    wvFilter(worldview),
  ]);

  // Add layer from the vector tile source with data-driven styles
  if (!map.getLayer(level + 'join')) {
    // Polygon layer
    map.addLayer(
      {
        id: level + 'join',
        type: 'fill',
        source: level + 'join',
        'source-layer': polyLayerName,
        paint: {
          'fill-opacity': 1,
        },
      },
      insertBeforeLayer
    );

    // Point layer
    // This is used to visually locate boundaries at lower zoom levels
    map.addLayer({
      id: level + 'Points',
      type: 'symbol',
      source: level.slice(0, -1) + 'Points',
      'source-layer': polyLayerName.replace('boundaries', 'points'),
      layout: {
        'text-field': ['concat', ['get', 'name'], '\n', ['get', 'name_en']],
        'text-font': ['Open Sans SemiBold', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'icon-image': 'dot-11',
        // "text-ignore-placement": true,
        // "text-allow-overlap": true,
        'text-anchor': 'bottom',
        'text-offset': [0, -0.3],
      },
      paint: {
        'text-halo-color': 'hsla(279, 1%, 100%, 0.94)',
        'text-halo-width': 2,
      },
      filter: ['==', ['id'], -1],
    });
  }
  map.setFilter(level + 'join', featureFilter);

  function fillColorExpression(opacity) {
    return [
      'to-color',
      [
        'concat',
        'hsla(',
        [
          '*',
          [
            '+',
            [
              '+',
              [
                'index-of',
                ['slice', ['get', 'mapbox_id'], 15, 16],
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
              ],
              [
                'index-of',
                ['slice', ['get', 'mapbox_id'], 16, 17],
                't6QRGZeAg4Mnmf2vILHFB7zJVE5KbPaiNYTcj1u30Sw8dXWlkysqpChOxU9orD',
              ],
            ],
            [
              'index-of',
              ['slice', ['get', 'mapbox_id'], 17, 18],
              'Uo56bWvJM8D7ABqLQeERu0VmHNiFPSsx3apYhKnjy9CIrGZOTz1lwfX24kcgtd',
            ],
          ],
          40,
        ],
        `, 80%, 90%,${opacity})`,
      ],
    ];
  }

  // Set polygon fill color using the feature id
  map.setPaintProperty(level + 'join', 'fill-color', [
    'case',
    ['==', ['feature-state', 'select'], 1],
    fillColorExpression(0.9),
    ['==', ['feature-state', 'hover'], 1],
    fillColorExpression(0.3),
    fillColorExpression(0.5),
  ]);

  map.setPaintProperty(
    level + 'join',
    'fill-outline-color',
    'hsla(0, 0%, 50%,0.2)'
  );

  if (!map.getLayer(level + 'selectionLine')) {
    map.addLayer(
      {
        id: level + 'selectionLine',
        type: 'line',
        source: level + 'join',
        'source-layer': polyLayerName,
        layout: {},
        paint: {
          'line-color': [
            'case',
            ['==', ['feature-state', 'select'], 1],
            'hsla(30, 90%, 30%,1)',
            ['==', ['feature-state', 'hover'], 1],
            'hsla(0, 0%, 30%,0.6)',
            'rgba(0,0,0,0)',
          ],
          'line-width': {
            stops: [
              [5, 1],
              [14, 3],
            ],
          },
        },
      },
      insertBeforeLayer
    );
  }
  map.setFilter(level + 'selectionLine', featureFilter);
}

// Update required map sources
function initmap(lookup_data, level) {
  // Get the vector tile source to join to
  polyLayerName = lookup_data.polyLayerName;
  data = {};
  worldview = document.getElementById('selectWorldview').value;

  // Add polygon boundaries tileset for the level
  if (!map.getSource(level + 'join')) {
    map.addSource(level + 'join', {
      type: 'vector',
      url: 'mapbox://' + lookup_data.polyTilesetName,
      promoteId: 'mapbox_id',
    });
  }
  // Add point boundaries tileset for the type
  const type = level.slice(0, -1);
  if (!map.getSource(type + 'Points')) {
    map.addSource(type + 'Points', {
      type: 'vector',
      url:
        'mapbox://' +
        lookup_data.polyTilesetName.replace(level, type + 'Points'),
      promoteId: 'mapbox_id',
    });
  }

  function filterFeatures() {
    // Create a filter expression for the boundary layer using the country and worldview selection
    featureFilter = [
      'all',
      ['==', ['get', 'iso_3166_1'], country_filter],
      wvFilter(worldview),
    ];
  }

  filterFeatures();

  function updateState() {
    [worldview, 'all'].forEach(worldview => {
      if (worldview in lookup_data) {
        for (const key in lookup_data[worldview]) {
          data[key] = lookup_data[worldview][key];
          data[key].worldview = worldview;
        }
      }
    });

    // Update boundary count
    const boundaryCount = Object.keys(data).length;
    document.getElementById(
      'boundaryCount'
    ).innerHTML = `<span class="txt-bold">${numberWithCommas(
      boundaryCount
    )}</span> ${boundaryCount === 1 ? 'Boundary' : 'Boundaries'}`;
    // Generate table list if reasonable
    if (boundaryCount < 50000) {
      const features = [];
      Object.keys(data).forEach(key => {
        features.push(Object.assign(data[key], { id: key }));
      });

      features.sort((a, b) => {
        return a.hasOwnProperty('name_en')
          ? d3.ascending(a.name_en, b.name_en)
          : d3.ascending(a.name, b.name);
      });

      createFeatureTable(features);
    } else {
      document.getElementById('table').textContent = '';
    }

    //
    function createFeatureTable(data) {
      const pointSourceId = level.slice(0, -1) + 'Points';

      d3.select('#table table').remove();

      const thedatatable = d3
        .select('#table')
        .append('table')
        .attr('class', 'table txt-xs cursor-pointer');

      d3.select('#table').on('mouseleave', d => {
        // Reset the clicked feature from table
        const filter = featureFilter;
        filter[3] = ['==', ['id'], 0];
        map.setFilter(level + 'Points', filter);

        map.removeFeatureState({
          source: level + 'join',
          sourceLayer: lookup_data.polyLayerName,
        });
      });

      const tr = thedatatable
        .selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .attr('id', d => {
          return d.id;
        })
        .on('mousemove', d => {
          // Find the boundary feature id from the id attribute
          const feature_id = d.currentTarget.id;

          // Save current zoom level
          const zoom = map.getZoom();

          // Query source for features in current view
          const features = map.querySourceFeatures(pointSourceId, {
            sourceLayer: lookup_data.pointLayerName,
            filter: ['==', ['get', 'mapbox_id'], feature_id],
          });

          // If feature was not found, it is ouside the map view
          // Zoom out to the country extent and try again
          // TODO: BUGGY
          if (!features.length) {
            map.fitBounds(bounds, {
              duration: 0.5,
              padding: 20,
            });
            // map.on("moveend", findSourceFeatures);
          } else {
            showSourceFeature(features, zoom);
          }

          // Find the feature in the tileset source
          function findSourceFeatures(feature_id) {
            map.off('moveend', findSourceFeatures);

            // Query source for features in current view
            const features = map.querySourceFeatures(pointSourceId, {
              sourceLayer: lookup_data.pointLayerName,
              filter: ['==', ['get', 'mapbox_id'], feature_id],
            });

            showSourceFeature(features, zoom);
          }

          // Show the source feature on the map
          function showSourceFeature(features, zoom) {
            // Reset the clicked feature from table
            const filter = featureFilter;
            filter[3] = ['==', ['get', 'mapbox_id'], feature_id];
            map.setFilter(level + 'Points', filter);

            map.removeFeatureState({
              source: pointSourceId,
              sourceLayer: lookup_data.pointLayerName,
            });
            map.removeFeatureState({
              source: level + 'join',
              sourceLayer: lookup_data.polyLayerName,
            });

            // Set the hover feature state for the point and boundary
            map.setFeatureState(
              {
                id: feature_id,
                source: pointSourceId,
                sourceLayer: lookup_data.pointLayerName,
              },
              {
                hover: 1,
              }
            );

            map.setFeatureState(
              {
                id: feature_id,
                source: level + 'join',
                sourceLayer: lookup_data.polyLayerName,
              },
              {
                hover: 1,
              }
            );

            map.flyTo({
              zoom: zoom,
              center: features[0].geometry.coordinates,
              speed: 0.9,
            });
          }
        });

      tr.selectAll('td')
        .data(row => {
          return ['name'].map(d => {
            let label = '';
            const codeLabel = row.hasOwnProperty('code')
              ? `<span class="txt-kbd">${row['code']}</span> `
              : '';
            label += row.hasOwnProperty('wikidata_id')
              ? `<a class="link" target="_blank" href="https://www.wikidata.org/wiki/${row.wikidata_id}">${codeLabel}</a>`
              : codeLabel;
            label += row.hasOwnProperty('name') ? `${row['name']} ` : '';
            label += row.hasOwnProperty('name_en')
              ? `/ ${row['name_en']} `
              : '';
            return {
              column: d,
              value: label,
            };
          });
        })
        .enter()
        .append('td')
        .html(d => {
          return d.value;
        });
    }
  }

  const setState = function (e) {
    if (e.sourceId === level + 'join') {
      map.off('sourcedataloading', setState);
      updateState();
    }
  };

  if (map.isSourceLoaded(level + 'join')) {
    updateState();
    map.off('sourcedataloading', setState);
  } else {
    map.on('sourcedataloading', setState);
  }

  loadingbar.style.visibility = 'hidden';

  // Popups and hovers
  setBboxFeatures();
  addPopupHover(level + 'join');
  addSelectClick(level + 'join');
}

function selectCountry(iso, worldview) {
  countryChange = true;
  country_filter = iso;

  document.getElementById('selectCountry').value = country_filter;
  document
    .getElementById('selectCountry')
    .dispatchEvent(new CustomEvent('change'));

  // Worldview is only passed by the initial detectUserLocation function. Dont trigger map update since the style is not yet fully loaded
  if (worldview) {
    document.getElementById('selectWorldview').value = worldview;
    document
      .getElementById('selectWorldview')
      .dispatchEvent(new CustomEvent('change'));
  } else {
    updateMap();
  }
}

//
// Utility functions
//

// Mapbox

// Returns an array of map style layers that match a given filter function
function findLayers(map, filterFn) {
  return map.getStyle().layers.filter(layer => {
    return filterFn ? filterFn(layer) : layer;
  });
}

// Creates a worldview filtes for Mapbox Boundaries tilesets
function wvFilter(worldview) {
  return [
    'any',
    ['==', 'all', ['get', 'worldview']],
    ['in', worldview, ['get', 'worldview']],
  ];
}

// Use the Wikidata QID to fetch the Wikipedia article summary for the given language code
function fetchArticleFromWikidata(qid, lang, cb) {
  // Query Wikidata for the Wikipedia page title
  fetch(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${qid}&sitefilter=${lang}wiki&origin=*`,
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Origin: 'https://demos.mapbox.com/boundaries-explorer/',
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      const wikidataJSON = data;

      // Fetch Wikipedia article if available
      if (
        wikidataJSON.entities[qid].sitelinks.hasOwnProperty(lang + 'wiki') &&
        wikidataJSON.entities[qid].sitelinks[lang + 'wiki'].hasOwnProperty(
          'title'
        )
      ) {
        const title = wikidataJSON.entities[qid].sitelinks[lang + 'wiki'].title;

        // Query Wikipedia to get the summary
        fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`,
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              Origin: 'https://demos.mapbox.com/boundaries-explorer/',
            },
          }
        )
          .then(response => response.json())
          .then(wikipediaJSON => {
            cb(wikidataJSON, wikipediaJSON);
          });
      }
    });
}

// General

// Return flag emoji for a ISO-3166-1 code
// https://dev.to/jorik/country-code-to-flag-emoji-a21
function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//
// Detect user country code
//

function detectUserLocation() {
  const supportedMapWorldviews = [
    'US',
    'CN',
    'IN',
    'JP',
    'AR',
    'MA',
    'RU',
    'TR',
  ];
  let selectedWorldview = null;
  let selectedCountryISO = null;

  const traceRequest = new XMLHttpRequest();
  traceRequest.open('GET', 'https://www.cloudflare.com/cdn-cgi/trace');

  traceRequest.onreadystatechange = () => {
    if (traceRequest.readyState == XMLHttpRequest.DONE) {
      if (traceRequest.status == 200) {
        selectedCountryISO = traceRequest.responseText
          .match(/loc=([^\n+]*)/)[1]
          .toUpperCase();

        // Select a worldview to match selected country, use US as default
        if (supportedMapWorldviews.indexOf(selectedCountryISO) > -1) {
          selectedWorldview = selectedCountryISO;
        } else if (['HK', 'MO'].indexOf(selectedCountryISO) > -1) {
          selectedWorldview = 'CN';
        } else {
          selectedWorldview = 'US';
        }

        urlParams.set('country', selectedCountryISO);

        selectCountry(selectedCountryISO, selectedWorldview);
      }
    }
  };

  traceRequest.send(null);
}

// Check if a mobile device
// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
