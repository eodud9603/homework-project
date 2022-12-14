import React, { SetStateAction, useRef } from 'react';

import { useReactiveVar } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';

import { modalState } from 'apollo/cache';
import { handleAddGroup } from 'utils/handleAddGroup';

const AddGroup = (props:{setMode:React.Dispatch<SetStateAction<string>>}) => {
  const ModalState = useReactiveVar(modalState);
  const groupName = useRef<string>('');

  const handleClose = () => {
    modalState({ ...modalState(),status:false });
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
            <Button variant="text" onClick={() => handleAddGroup(groupName, props.setMode)}>{ModalState.type === 'add' ? '등록' : '수정'}</Button>
          </Wrapper>
        </Box>
      </Modal>
    </>
  );
};

export default AddGroup;

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
