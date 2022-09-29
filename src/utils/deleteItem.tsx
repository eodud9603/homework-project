import { clickData, ClickData, polygonVar } from 'apollo/cache';

export const deleteItem = (e:ClickData) => {
  clickData(clickData().filter(data => data.id !== e.id));
  polygonVar()[polygonVar().findIndex(pv => pv.id == e.id)].polygon.setOptions({fillColor:'#DAE5EC'});
};
