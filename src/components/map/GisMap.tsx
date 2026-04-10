import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Settings } from 'lucide-react';
import { FUDING_CENTER, MAP_ZOOM, STATION_TYPES } from '../../utils/constants';
import { mockWaterStations, mockWeatherStations, mockWaterSourceAreas } from '../../services/mockData';
import { WaterStation, MapLayerState, QueryState } from '../../types';
import { DataChart } from '../panels/DataChart';
import { EnvStationPopup } from './EnvStationPopup';
import { WeatherStationPopup } from './WeatherStationPopup';
import { createRoot } from 'react-dom/client';
import { Search, Droplets, Thermometer, Wind, Radio, Waves, Map as MapIcon, Layers } from 'lucide-react';
import fudingGeoJSON from '../../assets/fuding.json';

interface GisMapProps {
  rightPanelOpen?: boolean;
  leftPanelOpen?: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({ rightPanelOpen = true, leftPanelOpen = true }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [layers, setLayers] = useState<MapLayerState>({
    weatherStations: true,
    envStations: true,
    temp: false,
    rain: false,
    wind: false,
    radar: false,
    centralizedWater: false,
    ruralWater: false,
  });

  const [query, setQuery] = useState<QueryState>({
    type: null,
    period: null,
  });

  const layerGroups = useRef<{ [key: string]: L.LayerGroup }>({});
  const overlayLayers = useRef<{ [key: string]: L.Layer }>({});

  // Handle map resize when panels toggle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (mapInstance.current) {
      timeoutId = setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 300);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [rightPanelOpen, leftPanelOpen]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: FUDING_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 7,
    }).addTo(mapInstance.current);

    // Initialize layer groups
    layerGroups.current.weather = L.layerGroup().addTo(mapInstance.current);
    layerGroups.current.env = L.layerGroup().addTo(mapInstance.current);
    layerGroups.current.water = L.layerGroup().addTo(mapInstance.current);
    layerGroups.current.overlays = L.layerGroup().addTo(mapInstance.current);
    layerGroups.current.waterAreas = L.layerGroup().addTo(mapInstance.current);

    // Fuding Boundary and Mask
    try {
      if (!mapInstance.current) return;
      
      const data = fudingGeoJSON as any;
      const fudingFeature = data.features.find((f: any) => f.properties.adcode === 350982 || f.properties.name === '福鼎市');
      const finalData = fudingFeature ? { type: 'FeatureCollection', features: [fudingFeature] } : data;
      const feature = fudingFeature || data.features[0];

      // 1. Create a mask
      let latLngs: L.LatLngExpression[] = [];
      if (feature.geometry.type === 'Polygon') {
        latLngs = feature.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]]);
      } else if (feature.geometry.type === 'MultiPolygon') {
        const largestPolygon = feature.geometry.coordinates.reduce((prev: any, curr: any) => 
          curr[0].length > prev[0].length ? curr : prev
        );
        latLngs = largestPolygon[0].map((coord: any) => [coord[1], coord[0]]);
      }
      
      if (latLngs.length > 0) {
        const worldOuter: L.LatLngExpression[] = [[90, -180], [90, 180], [-90, 180], [-90, -180], [90, -180]];
          L.polygon([worldOuter, latLngs], {
            color: 'transparent',
            fillColor: '#000',
            fillOpacity: 0.25,
            interactive: false
          }).addTo(mapInstance.current);
      }

      // 2. Highlight Fuding Boundary
      const boundaryLayer = L.geoJSON(finalData as any, {
        style: {
          color: '#00f2fe',
          weight: 4,
          fillColor: 'rgba(0, 242, 254, 0.1)',
          fillOpacity: 1,
          dashArray: '10, 5',
        }
      }).addTo(mapInstance.current);

      mapInstance.current.fitBounds(boundaryLayer.getBounds(), { padding: [40, 40] });
    } catch (err) {
      console.error('GeoJSON error:', err);
    }

    // Add Water Stations
    mockWaterStations.forEach((station: WaterStation) => {
      const typeInfo = STATION_TYPES[station.type];
      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative group">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white/50 transition-transform group-hover:scale-125" style="background-color: ${typeInfo.color}">
              ${typeInfo.icon}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(station.position, { icon: markerIcon });
      
      marker.on('click', () => {
        const popupContent = document.createElement('div');
        popupContent.className = 'w-[450px] h-[320px] dashboard-card tech-border p-3';
        const root = createRoot(popupContent);
        
        const popup = L.popup({ maxWidth: 500, className: 'custom-popup' })
          .setLatLng(station.position)
          .setContent(popupContent)
          .openOn(mapInstance.current!);
          
        root.render(<EnvStationPopup station={station} onClose={() => mapInstance.current?.closePopup(popup)} />);
          
        popup.on('remove', () => {
          root.unmount();
        });
      });

      marker.addTo(layerGroups.current.env);
    });

    // Add Weather Stations
    mockWeatherStations.forEach((station) => {
      const typeInfo = STATION_TYPES.weather;
      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative group">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white/50 transition-transform group-hover:scale-125" style="background-color: ${typeInfo.color}">
              ${typeInfo.icon}
            </div>
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-blue/30">
              ${station.name}: ${station.temp}℃
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(station.position as [number, number], { icon: markerIcon });
      
      marker.on('click', () => {
        const popupContent = document.createElement('div');
        popupContent.className = 'w-[480px] h-[360px] dashboard-card tech-border p-3';
        const root = createRoot(popupContent);
        
        const popup = L.popup({ maxWidth: 500, className: 'custom-popup' })
          .setLatLng(station.position as [number, number])
          .setContent(popupContent)
          .openOn(mapInstance.current!);
          
        root.render(<WeatherStationPopup station={station} onClose={() => mapInstance.current?.closePopup(popup)} />);
          
        popup.on('remove', () => {
          root.unmount();
        });
      });

      marker.addTo(layerGroups.current.weather);
    });

    // Add Water Source Areas (Simulated SHP)
    mockWaterSourceAreas.centralized.forEach(area => {
      L.polygon(area.coords as [number, number][], {
        color: '#10b981',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.3,
        dashArray: '5, 5'
      }).bindTooltip(area.name).addTo(layerGroups.current.waterAreas);
    });

    mockWaterSourceAreas.rural.forEach(area => {
      L.polygon(area.coords as [number, number][], {
        color: '#38bdf8',
        weight: 2,
        fillColor: '#38bdf8',
        fillOpacity: 0.3,
        dashArray: '5, 5'
      }).bindTooltip(area.name).addTo(layerGroups.current.waterAreas);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      layerGroups.current = {};
      overlayLayers.current = {};
    };
  }, []);

  const toggleLayer = (key: keyof MapLayerState) => {
    setLayers(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      
      // Handle layer visibility in Leaflet
      if (mapInstance.current) {
        if (key === 'weatherStations') {
          newState.weatherStations ? layerGroups.current.weather.addTo(mapInstance.current) : layerGroups.current.weather.remove();
        } else if (key === 'envStations') {
          newState.envStations ? layerGroups.current.env.addTo(mapInstance.current) : layerGroups.current.env.remove();
        } else if (['temp', 'rain', 'wind', 'radar'].includes(key)) {
          // Simulate meteorological overlays with large circles/polygons
          if (newState[key]) {
            const colors: { [key: string]: string } = { temp: '#f59e0b', rain: '#3b82f6', wind: '#06b6d4', radar: '#10b981' };
            const overlay = L.circle(FUDING_CENTER, {
              radius: 15000,
              color: colors[key],
              fillColor: colors[key],
              fillOpacity: 0.2,
              weight: 1
            }).addTo(layerGroups.current.overlays);
            overlayLayers.current[key] = overlay;
          } else {
            if (overlayLayers.current[key]) {
              overlayLayers.current[key].remove();
              delete overlayLayers.current[key];
            }
          }
        } else if (key === 'centralizedWater' || key === 'ruralWater') {
          newState.centralizedWater || newState.ruralWater 
            ? layerGroups.current.waterAreas.addTo(mapInstance.current) 
            : layerGroups.current.waterAreas.remove();
        }
      }
      
      return newState;
    });
  };

  const handleQuery = (type: 'rain' | 'temp' | 'wind', period: string) => {
    setQuery({ type, period });
    // In a real app, this would trigger a data fetch and map update
    console.log(`Querying ${type} for ${period}`);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* Query Panel - Top Left */}
      <div 
        className="absolute top-24 z-[1000] transition-all duration-300"
        style={{ left: leftPanelOpen ? '440px' : '20px' }}
      >
        <div className="dashboard-card p-3 space-y-3 min-w-[200px] border-brand-blue/30 tech-border">
          <div className="flex items-center gap-2 border-b border-white/10 pb-1">
            <Search className="w-3 h-3 text-brand-blue" />
            <h4 className="text-xs font-bold text-white italic tracking-wider">气象要素查询</h4>
          </div>
          
          <div className="space-y-3">
            {/* Rain Query */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>雨量查询</span>
              </div>
              <div className="flex gap-1">
                {['1h', '3h', '6h'].map(p => (
                  <button
                    key={p}
                    onClick={() => handleQuery('rain', p)}
                    className={`flex-1 py-1 text-[9px] rounded border transition-all ${query.type === 'rain' && query.period === p ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_8px_#00f2fe]' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-brand-blue/30'}`}
                  >
                    近{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Temp Query */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Thermometer className="w-3 h-3 text-orange-400" />
                <span>气温查询</span>
              </div>
              <div className="flex gap-1">
                {[
                  { id: '1h', label: '近1h' },
                  { id: '24h_max', label: '24h高' },
                  { id: '24h_min', label: '24h低' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleQuery('temp', p.id)}
                    className={`flex-1 py-1 text-[9px] rounded border transition-all ${query.type === 'temp' && query.period === p.id ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_8px_#00f2fe]' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-brand-blue/30'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wind Query */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span>风况查询</span>
              </div>
              <div className="flex gap-1">
                {['1h', '3h', '6h'].map(p => (
                  <button
                    key={p}
                    onClick={() => handleQuery('wind', p)}
                    className={`flex-1 py-1 text-[9px] rounded border transition-all ${query.type === 'wind' && query.period === p ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_8px_#00f2fe]' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-brand-blue/30'}`}
                  >
                    近{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Layer Controls - Aligned with panel top, below header */}
      <div 
        className="absolute top-24 z-[1000] flex flex-col gap-2 transition-all duration-300"
        style={{ right: rightPanelOpen ? '440px' : '20px' }}
      >
        <div className="dashboard-card p-3 space-y-3 min-w-[140px] border-brand-blue/30 tech-border">
          <div className="flex items-center gap-2 border-b border-white/10 pb-1">
            <Layers className="w-3 h-3 text-brand-blue" />
            <h4 className="text-xs font-bold text-white italic tracking-wider">图层控制</h4>
          </div>
          
          <div className="space-y-2">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">站点图层</p>
            <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-md hover:bg-brand-blue/10 transition-all border border-transparent hover:border-brand-blue/20">
              <input type="checkbox" checked={layers.weatherStations} onChange={() => toggleLayer('weatherStations')} className="hidden" />
              <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${layers.weatherStations ? 'bg-brand-blue border-brand-blue shadow-[0_0_8px_#00f2fe]' : 'border-slate-600'}`}>
                {layers.weatherStations && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-[11px] font-medium transition-colors ${layers.weatherStations ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>气象站</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-md hover:bg-brand-blue/10 transition-all border border-transparent hover:border-brand-blue/20">
              <input type="checkbox" checked={layers.envStations} onChange={() => toggleLayer('envStations')} className="hidden" />
              <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${layers.envStations ? 'bg-brand-blue border-brand-blue shadow-[0_0_8px_#00f2fe]' : 'border-slate-600'}`}>
                {layers.envStations && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-[11px] font-medium transition-colors ${layers.envStations ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>环保站</span>
            </label>
          </div>

          <div className="space-y-2 pt-1 border-t border-white/5">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">气象叠加</p>
            {[
              { id: 'temp', name: '温度图', icon: '🌡️' },
              { id: 'rain', name: '降雨图', icon: '🌧️' },
              { id: 'wind', name: '风况图', icon: '💨' },
              { id: 'radar', name: '雷达图', icon: '📡' },
            ].map(l => (
              <label key={l.id} className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-md hover:bg-brand-blue/10 transition-all border border-transparent hover:border-brand-blue/20">
                <input type="checkbox" checked={layers[l.id as keyof MapLayerState]} onChange={() => toggleLayer(l.id as keyof MapLayerState)} className="hidden" />
                <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${layers[l.id as keyof MapLayerState] ? 'bg-brand-blue border-brand-blue shadow-[0_0_8px_#00f2fe]' : 'border-slate-600'}`}>
                  {layers[l.id as keyof MapLayerState] && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={`text-[11px] font-medium transition-colors ${layers[l.id as keyof MapLayerState] ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{l.name}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2 pt-1 border-t border-white/5">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">水源地</p>
            <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-md hover:bg-brand-blue/10 transition-all border border-transparent hover:border-brand-blue/20">
              <input type="checkbox" checked={layers.centralizedWater} onChange={() => toggleLayer('centralizedWater')} className="hidden" />
              <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${layers.centralizedWater ? 'bg-brand-blue border-brand-blue shadow-[0_0_8px_#00f2fe]' : 'border-slate-600'}`}>
                {layers.centralizedWater && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-[11px] font-medium transition-colors ${layers.centralizedWater ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>集中饮用水</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-md hover:bg-brand-blue/10 transition-all border border-transparent hover:border-brand-blue/20">
              <input type="checkbox" checked={layers.ruralWater} onChange={() => toggleLayer('ruralWater')} className="hidden" />
              <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${layers.ruralWater ? 'bg-brand-blue border-brand-blue shadow-[0_0_8px_#00f2fe]' : 'border-slate-600'}`}>
                {layers.ruralWater && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-[11px] font-medium transition-colors ${layers.ruralWater ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>农村饮用水</span>
            </label>
          </div>
        </div>
      </div>

      {/* Legend Overlay - Aligned with panel bottom */}
      <div 
        className="absolute bottom-4 z-[1000] dashboard-card p-3 space-y-3 border-brand-blue/30 tech-border min-w-[160px] transition-all duration-300"
        style={{ left: leftPanelOpen ? '440px' : '20px' }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
          <MapIcon className="w-3 h-3 text-brand-blue" />
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">图例说明</h4>
        </div>
        
        <div className="space-y-2">
          <p className="text-[8px] text-slate-500 font-mono uppercase">站点类型</p>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.entries(STATION_TYPES).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: value.color, color: value.color }} />
                <span className="text-slate-300">{value.name}</span>
              </div>
            ))}
          </div>
        </div>

        {(layers.temp || layers.rain || layers.wind) && (
          <div className="space-y-2 pt-1 border-t border-white/5">
            <p className="text-[8px] text-slate-500 font-mono uppercase">色斑图级别</p>
            <div className="space-y-1.5">
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full" />
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>低</span>
                  <span>中</span>
                  <span>高</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
