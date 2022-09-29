import { clickData, polygonVar, SaveData, updateData } from '../apollo/cache';
import { Dispatch, SetStateAction } from 'react';

export const updateGroupList = (group: SaveData,setMode:Dispatch<SetStateAction<string>>) => {
  updateData(group);
  setMode('update');
  clickData([...group.data]);
  polygonVar().forEach(e => {
    if(clickData().findIndex(el => e.id === el.id) > -1) e.polygon.setOptions({fillColor:'#FE5500'})
    else e.polygon.setOptions({fillColor:'#DAE5EC'})
  })
}
