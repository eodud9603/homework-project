import React, { Fragment, memo, MouseEventHandler, useEffect, useRef, useState } from 'react';
import './App.css';
import { KakaoMap } from 'components/KakaoMap';
import styled from 'styled-components';
import { centerData, clickData, modalState, polygonVar, saveData, updateData } from './apollo/cache';
import { useReactiveVar } from '@apollo/client';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import AddGroup from './components/modal/AddGroup';


declare global {
  interface Window {
    kakao : any;
  }
}

const Container = styled.div`
  //width: 250px;
  //height: auto;
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
      
      .item-contents {
      //{display:'flex',flexDirection:'row',padding:2}
        display: flex;
        flex-direction: row;
        padding: 2px;
        .administrativeDistrict {
        //{flex:1,fontSize:12}
          display: flex;
          flex: 1;
          font-size: 12px;
        }
      }
      }
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

  @media (min-width: 1024px) {
    //grid-template-rows: 100px;
    //grid-template-columns: repeat(6, minmax(100px, 1fr));
  }
`

function App() {
  const reactiveClickData = useReactiveVar(clickData);
  const reactiveSaveData = useReactiveVar(saveData);
  const reactiveUpdateData = useReactiveVar(updateData);

  const [mode, setMode] = useState('add');


  const choiceScrollRef = useRef<HTMLDivElement>(null);
  const addScrollRef = useRef<HTMLDivElement>(null);

  const handleGroupControl = (e:any) => {
    console.log(e);
    console.log(clickData());
    if(clickData().length > 0) {
      if(mode === 'update') modalState({ type: 'update',status:true });
      else modalState({ type: 'add',status:true });
    }
    else alert('행정동을 선택해주세요.')
  }

  useEffect(() => {
    choiceScrollRef?.current?.scrollIntoView({behavior:'smooth'});
  },[reactiveClickData]);
  useEffect(() => {
    addScrollRef?.current?.scrollIntoView({behavior:'smooth'});
  },[reactiveSaveData]);

  useEffect(() => {
    saveData([...JSON.parse(localStorage.getItem('saveData') || '[]')])
  },[])
  // useEffect(() => {
  //   choiceScrollRef?.current?.scrollTo({ top:0,behavior:'smooth' });
  //   addScrollRef?.current?.scrollTo({ top:0,behavior:'smooth' });
  // },[mode])

  return (
    <div className="App">
        <Container>
          <AddGroup/>
          <KakaoMap/>
          <div className={'side-container'}>
          <div className={'box-container'}>
              <div className={'item-title'} onClick={() => {
                console.log('clickData ::',clickData())
              }}>{`선택한 행정동 ${mode === 'update' && updateData().id ? (' - ' + reactiveUpdateData.title) : ''}`}</div>
              <div className={'item-contents-wrapper'}>
                {reactiveClickData.map((e,i) =>
                <div key={i} className={'item-contents'} >
                  <div className={'administrativeDistrict'} key={i}>{e.name}</div>
                  <AiOutlineCloseSquare size={17} onClick={() => {
                    clickData(clickData().filter(data => data.id !== e.id));
                    polygonVar()[polygonVar().findIndex(pv => pv.id == e.id)].polygon.setOptions({fillColor:'#DAE5EC'})
                  }}/>
                </div>
                )}
                <div ref={choiceScrollRef} />
              </div>
              <div className={'btn-wrapper'}>
                <div className={'btn'} onClick={() => {
                  setMode('add');
                  polygonVar().forEach(e => {
                    e.polygon.setOptions({fillColor:'#DAE5EC'});
                  })
                  // TODO :: 취소했을때 선택한 행정동 리스트 지울지 말지 (clickData().length= 0)
                }}>취소</div>
                <div className={'btn'} onClick={handleGroupControl}>{mode === 'update' ? '수정하기' : '등록하기'}</div>
              </div>
          </div>
          <div style={{borderBottom:'1px solid'}}/>
            <div className={'box-container'}>
              <div className={'item-title'} onClick={(e) => {
                console.log('clickData ::',clickData());
                console.log('localStorage2 :: ',JSON.parse(localStorage.getItem('saveData') || '[]'));
              }}>등록한 행정동 그룹</div>
              <div className={'item-contents-wrapper'} style={{cursor:'pointer'}}>
                {reactiveSaveData.map((group,i) =>
                  <div key={i} onClick={() => {
                    updateData(group);
                    setMode('update');
                    clickData([...group.data]);
                    polygonVar().forEach(e => {
                      if(clickData().findIndex(el => e.id === el.id) > -1) e.polygon.setOptions({fillColor:'#FE5500'})
                      else e.polygon.setOptions({fillColor:'#DAE5EC'})
                    })
                    console.log('updateData ::',updateData());
                    console.log('clickData ::',clickData());
                    // console.log(updateData());
                  }}>
                    <div className={'item-contents'} >
                      <div className={'administrativeDistrict'} key={i}>{group.title}</div>
                      <AiOutlineCloseSquare size={17} />
                    </div>
                    {group.data.map((ad:any,idx:number) =>
                      <Fragment key={idx}>
                        <div key={idx} className={'administrativeDistrict'}>{ad.name}</div>
                      </Fragment>
                    )}
                  </div>
                )}
                <div ref={addScrollRef} />
              </div>
            </div>
          </div>
          {/*<div style={{height:250,padding:15}}>*/}
          {/*    <div onClick={() => {*/}
          {/*      console.log('polygon ::',polygonVar());*/}
          {/*    }}>등록한 행정동 그룹</div>*/}
          {/*    <div></div>*/}
          {/*    <div style={{display:'flex',flexDirection:'row',width:'100%'}}>*/}
          {/*      <div onClick={() => {*/}
          {/*        centerData([126.8003,35.1682]);*/}
          {/*        console.log(centerData())*/}
          {/*      }}>asd</div>*/}
          {/*      <div>bb</div>*/}
          {/*    </div>*/}
          {/*</div>*/}
        </Container>
    </div>
  );
}



export default App;
