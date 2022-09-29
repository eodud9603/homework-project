import React, {  useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { useReactiveVar } from '@apollo/client';
import { AiOutlineCloseSquare } from 'react-icons/ai';

import './App.css';
import {
  clickData, modalState,
  saveData,
  updateData,
} from 'apollo/cache';
import { KakaoMap } from 'components/KakaoMap';
import AddGroup from 'components/modal/AddGroup';

import { handleGroupControl } from 'utils/handleGroupControl';
import { deleteItem } from 'utils/deleteItem';
import { deleteItemList } from 'utils/deleteItemList';
import { updateGroupList } from 'utils/updateGroupList';
import { deleteGroupList } from 'utils/deleteGroupList';

function App() {
  const reactiveClickData = useReactiveVar(clickData);
  const reactiveSaveData = useReactiveVar(saveData);
  const reactiveUpdateData = useReactiveVar(updateData);
  const [mode, setMode] = useState('add');

  const num = useRef<number>(0);

  const choiceScrollRef = useRef<HTMLDivElement>(null);
  const addScrollRef = useRef<HTMLDivElement>(null);
  const choiceScrollBtRef = useRef<HTMLDivElement>(null);
  const addScrollBtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    choiceScrollBtRef?.current?.scrollIntoView({behavior:'smooth'});
  },[reactiveClickData]);
  useEffect(() => {
    if(num.current > 2 && modalState()?.prev !== 'update')
      addScrollBtRef?.current?.scrollIntoView({behavior:'smooth'});
    else num.current = num.current + 1;
  },[reactiveSaveData]);
  useEffect(() => {
    saveData([...JSON.parse(localStorage.getItem('saveData') || '[]')])
    addScrollRef?.current?.scrollTo({top:0,behavior:'smooth'});
  },[]);

  return (
    <div className="App">
        <Container>
          <AddGroup setMode={setMode}/>
          <KakaoMap/>
          <div className={'side-container'}>
          <div className={'box-container'}>
              <div className={'item-title'}>{`선택한 행정동 ${mode === 'update' && updateData().id ? (' - ' + reactiveUpdateData.title) : ''}`}</div>
              <div className={'item-contents-wrapper'} ref={choiceScrollRef}>
                {reactiveClickData.map((e,i) =>
                  <div key={i} className={'item-contents'} >
                    <div className={'administrativeDistrict'} key={i}>{e.name}</div>
                    <AiOutlineCloseSquare size={17} onClick={() => deleteItem(e)}/>
                  </div>
                )}
                <div ref={choiceScrollBtRef} />
              </div>
              <div className={'btn-wrapper'}>
                <div className={'btn cursor'} onClick={() => deleteItemList(setMode)}>{mode === 'update' ? '수정취소' : '취소'}</div>
                <div className={'btn cursor'} onClick={() => handleGroupControl(mode)}>{mode === 'update' ? '수정하기' : '등록하기'}</div>
              </div>
          </div>
          <div style={{borderBottom:'1px solid'}}/>
            <div className={'box-container'}>
              <div className={'item-title'}>등록한 행정동 그룹</div>
              <div className={'item-contents-wrapper cursor'} ref={addScrollRef}>
                {reactiveSaveData.map((group,i) =>
                  <div className={'mb'} key={i} onClick={() => updateGroupList(group,setMode)}>
                    <div className={'item-contents'}>
                      <div className={'administrativeDistrictTitle'} key={i}>{group.title}</div>
                      <AiOutlineCloseSquare size={17} onClick={(event) => deleteGroupList(event,group)}/>
                    </div>
                    {group.data.map((ad:{ name:string },idx:number) =>
                      <div key={idx} className={'item-contents ml'}>
                        <div key={idx} className={'administrativeDistrict'}>{ad.name}</div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={addScrollBtRef}/>
              </div>
            </div>
          </div>
        </Container>
    </div>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f5f6f7;
  
  .side-container {
    display: flex;
    flex-direction: column;
    min-width: 230px;
  }
  .box-container {
    height:50%;
    padding:10px;
    
    .item-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
    .item-contents-wrapper {
      height: 170px;
      overflow: scroll;
      padding: 7px;
      padding-top: 0px;
      
      .item-contents {
        display: flex;
        flex-direction: row;
        padding: 2px;
        .administrativeDistrict {
          display: flex;
          flex: 1;
          font-size: 12px;
        }
        .administrativeDistrictTitle {
          display: flex;
          flex: 1;
          font-size: 14px;
          font-weight: 600;
        }
      }
      }
    }
  .cursor{
    cursor: pointer;
  }
  .ml {
    margin-left: 5px;
  }
  .mb {
    margin-bottom: 5px;
  }
  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
  }
  .btn {
    font-size: 12px;
    border: 1px solid;
    padding: 3px;
    min-width: 70px;
    text-align: center;
  }
`
