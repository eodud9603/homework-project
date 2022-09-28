import { InMemoryCache,makeVar} from "@apollo/client";

export const cache = new InMemoryCache();
//선택,등록,수정 데이터
export const clickData = makeVar(new Array<any>());
export const saveData = makeVar(new Array<any>());
export const updateData = makeVar({id:undefined,title:undefined,data:[]});
//카카오 맵
export const polygonVar = makeVar(new Array<any>());
export const centerData = makeVar([127.055326, 37.510135]);
//모달
export const modalState = makeVar({ type:'add',status:false });
