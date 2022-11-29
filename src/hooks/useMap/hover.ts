import { AnyLayer, EventData, Map } from 'mapbox-gl';

export const onHover = (map: Map, layer: AnyLayer, sourceLayer: string) => {
  let hoveredStateId: any = null;

  const onMouseMove = (e: EventData) => {
    if (!e.features || !e.features.length) return;
    if (hoveredStateId) {
      const geo = { source: 'composite', sourceLayer, id: hoveredStateId };
      map.setFeatureState(geo, { hover: false });
    }
    hoveredStateId = e.features[0].id;
    const geo = { source: 'composite', sourceLayer, id: hoveredStateId };
    map.setFeatureState(geo, { hover: true });
  };

  const onMouseLeave = () => {
    if (hoveredStateId) {
      const geo = { source: 'composite', sourceLayer, id: hoveredStateId };
      map.setFeatureState(geo, { hover: false });
    }
    hoveredStateId = null;
  };

  map.on('mousemove', layer.id, onMouseMove);
  map.on('mouseleave', layer.id, onMouseLeave);
};
