import React, { SetStateAction } from 'react';
import { clickData, modalState, polygonVar, saveData, updateData } from 'apollo/cache';

export const handleAddGroup = (groupName:React.MutableRefObject<string>,setMode:React.Dispatch<SetStateAction<string>>) => {
  if(groupName?.current?.trim() == '') {
    alert('그룹이름을 입력해주세요 !');
    return;
  };
  if(updateData()?.id && modalState().type === 'update') {
    const saveArr = Array.from(saveData());
    let saveArrIndex = saveData().findIndex(e=>e.id === updateData().id);
    saveArr[saveArrIndex].data = clickData();
    saveArr[saveArrIndex].title = groupName.current!;
    saveData([...saveArr]);
    setMode('add');
  } else saveData([...saveData(),{id: new Date() + Math.random().toString(),title:groupName.current,data:clickData() }]);
  polygonVar().forEach(e => {
    if(clickData().findIndex(pv => pv.id == e.id) > -1)  e.polygon.setOptions({fillColor:'#DAE5EC'});
  });
  clickData([]);
  groupName.current = '';
  updateData({ data: [], id: '', title: '' });
  modalState({ prev: modalState().type,type:'add', status:false });
  localStorage.setItem('saveData',JSON.stringify(saveData()));
};
