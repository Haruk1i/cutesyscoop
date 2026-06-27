import {Order,Product,Scoop} from './types';
const K={p:'cutesy_products',s:'cutesy_scoops',o:'cutesy_orders',a:'cutesy_admin'};
const read=<T,>(k:string,f:T):T=>typeof window==='undefined'?f:JSON.parse(localStorage.getItem(k)||JSON.stringify(f));
const write=<T,>(k:string,v:T)=>localStorage.setItem(k,JSON.stringify(v));
export const api={products:()=>read<Product[]>(K.p,[]),scoops:()=>read<Scoop[]>(K.s,[]),orders:()=>read<Order[]>(K.o,[]),saveProducts:(v:Product[])=>write(K.p,v),saveScoops:(v:Scoop[])=>write(K.s,v),saveOrders:(v:Order[])=>write(K.o,v),admin:()=>read<boolean>(K.a,false),login:()=>write(K.a,true),logout:()=>write(K.a,false)};
export const id=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
