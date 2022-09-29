import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { centerData, clickData, polygonVar } from '../apollo/cache';

interface AdministrativeDistrictProp {
  id:number;
  name:string;
  region: {type:string ,coordinates:number[] };
}
interface AdministrativeDistrictProps {
  administrativeDistrictsByCenter: AdministrativeDistrictProp[];
}
interface DisplayArea {
  id:number,
  name:string,
  coordinates : any
}

const GET_PATH = (point: string) =>  gql`
  query {
    administrativeDistrictsByCenter(center:{
        type:Point,
        coordinates: ${point}
      }){
        id,
        name,
        region
}}
`;
const Width = innerWidth;
export const KakaoMap = () => {
  const { loading, error, data } = useQuery<AdministrativeDistrictProps>(GET_PATH(JSON.stringify(useReactiveVar(centerData))));
  const map = useRef<any>();
  useEffect(() => {
    const mapContainer = document.getElementById('map'); // 지도를 표시할 div
    const mapOption = {
      center: new window.kakao.maps.LatLng(centerData()[1], centerData()[0]), // 지도의 중심좌표
      level: 7 // 지도의 확대 레벨
    };
    if(!map.current) map.current = new window.kakao.maps.Map(mapContainer, mapOption);
    window.kakao.maps.event.addListener(map.current, 'dragend', function() {
      centerData([map.current.getCenter().getLng(),map.current.getCenter().getLat()]);
    });

  },[]);

  useEffect(() => {
    // 다각형을 생상하고 이벤트를 등록하는 함수입니다
    async function displayArea(id:number, name:string, coordinates:any ) {
      const path: any[] = [];
      let points : object[] = [];

      coordinates[0]?.forEach((coordinate:number[]) => {
        let point = {x:0,y:0};
        point.x = coordinate[1];
        point.y = coordinate[0];
        points.push(point);
        path.push(new window.kakao.maps.LatLng(coordinate[1], coordinate[0]));
      });

      // 다각형을 생성합니다
      let polygon = new window.kakao.maps.Polygon({
        map: map.current, // 다각형을 표시할 지도 객체
        path: path,
        strokeWeight: 2,
        strokeColor: '#6D98B6',
        strokeOpacity: 1,
        fillColor: clickData().findIndex(e => e.id == id) > -1 ?  '#FE5500':'#DAE5EC',
        fillOpacity: 0.8
      });
      polygonVar().push({polygon:polygon,id:id});

      // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
      window.kakao.maps.event.addListener(polygon, 'click', function() {
        let clickDataIndex = clickData().findIndex(e=>e.id === id);
        if(clickDataIndex < 0) { //폴리곤 선택
          clickData([...clickData(),{id:id,name:name}])
          polygon.setOptions({fillColor: '#FE5500'});
        } else {//선택된 폴리곤 선택

          clickData(clickData().filter((data,index) => index !== clickDataIndex));
          polygon.setOptions({fillColor: '#DAE5EC'});
        }
        // if(clickData().findIndex(e=>e.id === id) < 0) clickData([...clickData(),{id:id,name:name}])
        // polygon.setOptions({fillColor: '#FE5500'});

      });
    }

    data?.administrativeDistrictsByCenter.forEach((val) => {
      if(polygonVar().findIndex(e => e.id == val.id) < 0) displayArea(val.id,val.name, val.region.coordinates[0]);
    });

    return(() => {
    });

  },[data]);

  return<>
    <div id={'map'} style={{ width:800,height:500 }}></div>
  </>
};
