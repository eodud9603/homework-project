import { clickData, polygonVar, updateData } from 'apollo/cache';
import { Dispatch, SetStateAction } from 'react';

export const deleteItemList = (setMode:Dispatch<SetStateAction<string>>) => {
  setMode('add');
  polygonVar().forEach(e => {
    e.polygon.setOptions({fillColor:'#DAE5EC'});
  })
  updateData({id:'',title:'',data:[]});
  clickData().length = 0;
}

