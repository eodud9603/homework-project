import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React, { useEffect, useRef } from 'react';
import { areas } from '../tmp';
import { centerData, clickData, polygonVar } from '../apollo/cache';

interface AdministrativeDistrictProp {
  id:number;
  name:string;
  region: {type:string ,coordinates:number[] };
}
interface AdministrativeDistrictProps {
  administrativeDistrictsByCenter: AdministrativeDistrictProp[];
}
// [127.055326, 37.510135]
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

export const KakaoMap = () => {
  const { loading, error, data } = useQuery<AdministrativeDistrictProps>(GET_PATH(JSON.stringify(useReactiveVar(centerData))));

  useEffect(() => {
    const mapContainer = document.getElementById('map'); // 지도를 표시할 div
    const mapOption = {
      // center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      center: new window.kakao.maps.LatLng(centerData()[1], centerData()[0]), // 지도의 중심좌표
      level: 7 // 지도의 확대 레벨
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    console.log('center :: ', map.getCenter());
    console.log('data :: ',data);
    console.log('centerData :: ',centerData());

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    // window.kakao.maps.event.addListener(map, 'idle', function() {
    //   centerData([map.getCenter().getLng(),map.getCenter().getLat()]);
    // });
    // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    // window.kakao.maps.event.addListener(map, 'center_changed', function() {
    //   centerData([map.getCenter().getLng(),map.getCenter().getLat()]);
    // });
    // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    window.kakao.maps.event.addListener(map, 'dragend', function() {
      centerData([map.getCenter().getLng(),map.getCenter().getLat()]);
    });

      // 다각형을 생상하고 이벤트를 등록하는 함수입니다
    async function displayArea(id:any,index:number,name:any,coordinates :any) {
      const path: any[] = [];
      let points : any[] = [];

      coordinates[0].forEach((coordinate:any) => {
        let point = {x:0,y:0};
        point.x = coordinate[1];
        point.y = coordinate[0];
        points.push(point);
        path.push(new window.kakao.maps.LatLng(coordinate[1], coordinate[0]));
      });

      // 다각형을 생성합니다
      let polygon = new window.kakao.maps.Polygon({
        map: map, // 다각형을 표시할 지도 객체
        path: path,
        strokeWeight: 2,
        // strokeColor: '#004c80',
        strokeColor: '#6D98B6',
        strokeOpacity: 1,
        fillColor: clickData().findIndex(e => e.id == id) > -1 ?  '#FE5500':'#DAE5EC',
        fillOpacity: 0.8
      });
      let polygonIndex = polygonVar().findIndex(e => e.id == id)
      if(polygonIndex < 0) {
        polygonVar().push({polygon:polygon,id:id});
      } else {
        polygonVar()[polygonIndex] = {polygon:polygon,id:id};
      }

      // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
      window.kakao.maps.event.addListener(polygon, 'click', function(mouseEvent: { latLng: any; }) {
        if(clickData().findIndex(e=>e.id === id) < 0)
        clickData([...clickData(),{id:id,name:name}])
        polygon.setOptions({fillColor: '#FE5500'});
        console.log('option :: ',index);
        console.log('latlng :: ',mouseEvent.latLng);
        console.log('name::',name );
      });
    }

    data?.administrativeDistrictsByCenter.forEach((val, index) => {
      displayArea(val.id,index,val.name, val.region.coordinates[0]);
    });

    return(() => {
      // console.log('dd');
    });



  },[data]);

  return<>
    <div id={'map'} style={{ width:700,height:500 }}></div>
  </>
};
