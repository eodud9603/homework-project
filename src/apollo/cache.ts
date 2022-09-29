import { InMemoryCache,makeVar} from "@apollo/client";

declare global {
  interface Window {
    kakao : any;
  }
}

export interface ClickData {
  id:number;//행정동 id
  name:string;//행정동 이름
}
export interface SaveData {
  id:string;//seq
  title:string;//행정동 그룹 이름
  data:ClickData[];
}
interface UpdateData {id:string,title:string,data:object[]}
interface PolygonVar {
  id:number;
  polygon:any;
}
interface ModalState {
  type: string | 'add';
  status: boolean | false;
}
export const cache = new InMemoryCache();

//선택,등록,수정 데이터
export const clickData = makeVar<ClickData[]>([]);
export const saveData = makeVar<SaveData[]>([]);
export const updateData = makeVar<UpdateData>({id:'',title:'',data:[]});
//카카오 맵
export const polygonVar = makeVar<PolygonVar[]>([]);
export const centerData = makeVar<number[]>([127.055326, 37.510135]);
//모달
export const modalState = makeVar<ModalState>({type:'add',status:false});
