import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, ChevronRight, House, MapPin, RotateCcw } from 'lucide-react';
import { houses } from './data/story';
import { mapCategories, storyLocations } from './data/map-locations';

let leafletPromise = null;
function loadLeaflet() {
  if (window.L?.map) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve,reject) => {
      if (!document.querySelector('link[data-ef-leaflet]')) {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
        style.dataset.efLeaflet = 'true';
        document.head.appendChild(style);
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => window.L?.map ? resolve(window.L) : reject(new Error('지도를 초기화할 수 없습니다.'));
      script.onerror = () => reject(new Error('지도 라이브러리를 불러오지 못했습니다.'));
      document.head.appendChild(script);
    }).catch(err=>{leafletPromise=null;throw err});
  }
  return leafletPromise;
}

const categories = {house:'오대명가 본가',home:'개인 주거지',work:'회사 · 업무지'};
const groupColors = {home:'#527F69',work:'#427E95'};
function colorFor(place) {
  return place.houseId ? houses.find(h=>h.id===place.houseId)?.tint || '#A68D52' : groupColors[place.type];
}
function LocationSymbol({type,size=17}) {
  return type==='house' ? <House size={size}/> : type==='work' ? <Building2 size={size}/> : <MapPin size={size}/>;
}
export default function MapApp() {
  const [category,setCategory] = useState('all');
  const [selectedId,setSelectedId] = useState(null);
  const [status,setStatus] = useState('loading');
  const [retry,setRetry] = useState(0);
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef(new Map());
  const visible = useMemo(() => category==='all' ? storyLocations : storyLocations.filter(p=>p.type===category), [category]);
  const selected = storyLocations.find(p=>p.id===selectedId);

  useEffect(() => {
    let disposed = false;
    setStatus('loading');
    loadLeaflet().then(L => {
      if (disposed || !mapElement.current) return;
      const map = L.map(mapElement.current, {
        zoomControl:false, scrollWheelZoom:false, preferCanvas:true,
        attributionControl:true
      });
      leafletRef.current = L;
      mapRef.current = map;
      L.control.zoom({position:'bottomright'}).addTo(map);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'&copy; OpenStreetMap contributors',
        maxZoom:18,
        minZoom:9
      }).addTo(map);
      map.setView([37.558,126.994],11);
      setStatus('ready');
      requestAnimationFrame(()=>{if(!disposed)map.invalidateSize()});
    }).catch(()=>{if(!disposed)setStatus('failed')});
    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
  },[retry]);

  useEffect(() => {
    const map=mapRef.current, L=leafletRef.current;
    if(status!=='ready'||!map||!L)return;
    markersRef.current.forEach(marker=>map.removeLayer(marker));
    markersRef.current.clear();
    visible.forEach(place=>{
      const marker=L.circleMarker([place.lat,place.lng],{
        radius:8,weight:2,color:'#FFFFFF',fillColor:colorFor(place),
        fillOpacity:1,opacity:1
      }).addTo(map);
      marker.bindTooltip(place.name, {direction:'top',offset:[0,-9]});
      marker.on('click',()=>setSelectedId(place.id));
      markersRef.current.set(place.id,marker);
    });
    if(visible.length) {
      const bounds=L.latLngBounds(visible.map(p=>[p.lat,p.lng]));
      map.fitBounds(bounds.pad(0.18),{padding:[18,18],maxZoom:13,animate:false});
      requestAnimationFrame(()=>mapRef.current?.invalidateSize());
    }
  },[category,status,visible]);

  useEffect(() => {
    if(status!=='ready')return;
    markersRef.current.forEach((marker,id)=>{
      const on=id===selectedId;
      marker.setStyle({radius:on?11:8,weight:on?4:2,color:on?'#2E4032':'#FFFFFF'});
      if(on)marker.bringToFront();
    });
    const place=visible.find(p=>p.id===selectedId);
    if(place&&mapRef.current){
      mapRef.current.flyTo([place.lat,place.lng],Math.max(mapRef.current.getZoom(),13),{animate:true,duration:.65});
    }
  },[selectedId,category,status,visible]);

  const changeCategory = next => {setCategory(next);setSelectedId(null)};
  const resetView=()=>{
    setCategory('all');
    setSelectedId(null);
    const map=mapRef.current,L=leafletRef.current;
    if(map&&L)map.fitBounds(L.latLngBounds(storyLocations.map(p=>[p.lat,p.lng])).pad(.18),{padding:[18,18],maxZoom:13,animate:true});
  };

  return <div className="app-content ef-map-app">
    <div className="section-kicker">ELEGANT FRACTURES · SEOUL</div>
    <div className="ef-map-heading">
      <div><h2>서울 주요 장소</h2><p>오대명가와 사람들의 생활 공간</p></div>
      <span className="ef-map-count">{storyLocations.length} PLACES</span>
    </div>
    <div className="ef-map-filters" aria-label="장소 분류">
      {mapCategories.map(c=><button type="button" key={c.id} className={category===c.id?'selected':''}
        aria-pressed={category===c.id} onClick={()=>changeCategory(c.id)}>
        {c.name} <span>{c.id==='all'?storyLocations.length:storyLocations.filter(p=>p.type===c.id).length}</span>
      </button>)}
    </div>
    <div className="ef-map-frame">
      <div ref={mapElement} className="ef-map-canvas" role="region" aria-label="서울의 가문 본가, 주거지, 업무지 지도"/>
      {status==='loading'&&<div className="ef-map-overlay"><MapPin size={25}/><strong>서울 지도를 불러오는 중</strong></div>}
      {status==='failed'&&<div className="ef-map-overlay"><MapPin size={25}/><strong>지도를 불러오지 못했어</strong><small>아래 장소 목록은 계속 확인할 수 있어.</small><button type="button" onClick={()=>setRetry(n=>n+1)}>다시 시도</button></div>}
      {status==='ready'&&<button className="ef-map-reset" type="button" onClick={resetView} aria-label="지도 전체 보기"><RotateCcw size={15}/><span>전체 보기</span></button>}
    </div>
    <div className="ef-map-legend"><span><i className="ef-dot house"/>오대명가 본가</span><span><i className="ef-dot home"/>주거지</span><span><i className="ef-dot work"/>업무지</span></div>
   

    {selected&&<section className="ef-map-selected" aria-live="polite" style={{'--place-color':colorFor(selected)}}>
      <span className="ef-map-selected-type">{categories[selected.type]}</span>
      <h3>{selected.name}</h3>
      <div className="ef-map-selected-area"><MapPin size={14}/>{selected.region} · {selected.area}</div>
      <strong>{selected.subtitle}</strong>
      <p>{selected.description}</p>
    </section>}

    <div className="ef-map-list-heading">
      <strong>{mapCategories.find(c=>c.id===category)?.description}</strong>
      <span>{visible.length}곳</span>
    </div>
    <div className="ef-map-place-list">
      {visible.map(place=><button className={'ef-map-place'+(selectedId===place.id?' selected':'')} type="button" aria-pressed={selectedId===place.id} key={place.id} onClick={()=>setSelectedId(place.id)}>
        <span className="ef-map-place-icon" style={{'--place-color':colorFor(place)}}><LocationSymbol type={place.type}/></span>
        <span className="ef-map-place-text"><strong>{place.name}</strong><small>{place.area} · {place.subtitle}</small></span>
        <ChevronRight size={16}/>
      </button>)}
    </div>
  </div>;
}
