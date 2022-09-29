import { clickData, modalState } from 'apollo/cache';

export const handleGroupControl = (mode:string) => {
    if(clickData().length > 0) {
      if(mode === 'update') modalState({ type: 'update',status:true });
      else modalState({ type: 'add',status:true });
    }
    else alert('행정동을 선택해주세요.')
  };
