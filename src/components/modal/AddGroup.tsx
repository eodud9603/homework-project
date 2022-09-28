import React, { useRef, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { clickData, modalState, polygonVar, saveData, updateData } from '../../apollo/cache';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { InputBase } from '@mui/material';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign:'center',
  borderRadius:2,
  p: 2,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex:1;
  justify-content: flex-end;
  margin: 5px;
`;

//TODO :: 코드 정리 ,css 수정 , 수정 모달 시 그룹이름 표기
const AddGroup = () => {
  const ModalState = useReactiveVar(modalState);
  const groupName = useRef<string>('');

  const handleClose = () => {
    modalState({ ...modalState(),status:false });
    console.log(saveData() );
  };

  const handleAddGroup = () => {
    if(groupName.current == '') {
      alert('그룹이름을 입력해주세요 !');
      return;
    };
    if(updateData()?.id && modalState().type === 'update') {
      console.log('11 :: ',saveData());
        const saveArr = Array.from(saveData());
        let saveArrIndex = saveData().findIndex(e=>e.id === updateData().id);
        saveArr[saveArrIndex].data = clickData();
        saveArr[saveArrIndex].title = groupName.current;
        console.log('22 :: ',saveArr);
        saveData([...saveArr]);
      } else saveData([...saveData(),{id: new Date() + Math.random().toString(),title:groupName.current,data:clickData() }]);
      polygonVar().forEach(e => {
        if(clickData().findIndex(pv => pv.id == e.id) > -1)  e.polygon.setOptions({fillColor:'#DAE5EC'});
      });
      clickData([]);
      groupName.current = '';
      updateData({id:undefined,title:undefined,data:[]});
      modalState({ type:'add',status:false });
      localStorage.setItem('saveData',JSON.stringify(saveData()));
  };

  return (
    <>
      <Modal
        open={ModalState.status}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{borderBottom:'1px solid'}} id="modal-modal-title" variant="h6" component="h2" mb={3}>
            행정동 그룹 {ModalState.type === 'add' ? '생성' : '수정'}
          </Typography>
          <Wrapper>
            <TextField style={{flex:1}} id="standard-basic" label="" variant="standard" placeholder={'그룹이름을 입력하세요.'} onChange={e=>groupName.current = e.target.value}/>
          </Wrapper>
          <Wrapper>
            <Button variant="text" onClick={handleClose}>취소</Button>
            <Button variant="text" onClick={handleAddGroup}>{ModalState.type === 'add' ? '등록' : '수정'}</Button>
          </Wrapper>
        </Box>
      </Modal>
    </>
  );
};

export default AddGroup;
