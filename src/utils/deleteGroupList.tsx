import React from 'react';
import { modalState, saveData, SaveData, updateData } from 'apollo/cache';

export const deleteGroupList = (event:React.MouseEvent<SVGElement>,group:SaveData) => {
  event.stopPropagation();
  if(updateData().id === group.id){
    alert('수정중인 그룹은 삭제할 수 없습니다.');
    return;
  }
  modalState({...modalState(),prev:'update'});
  saveData(saveData().filter(col => col.id !== group.id));
  localStorage.setItem('saveData',JSON.stringify(saveData()));
}
