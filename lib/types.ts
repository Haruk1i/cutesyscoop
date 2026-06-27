export type Rarity='Silver'|'Gold'|'Platinum'|'Rainbow';
export type Status='Хүлээгдэж байна'|'Төлбөр шалгаж байна'|'Бэлтгэж байна'|'Хүргэлтэнд гарсан'|'Хүргэгдсэн'|'Дууссан'|'Цуцлагдсан';
export type Product={id:string;name:string;image:string;price:number;salePrice?:number;description:string;stock:number;rarity:Rarity};
export type ScoopItem={productId:string;chance:number;rarity:Rarity};
export type Scoop={id:string;name:string;cover:string;price:number;salePrice?:number;description:string;active:boolean;items:ScoopItem[]};
export type Order={id:string;scoopId:string;scoopName:string;customerName:string;phone:string;address:string;paymentMethod:'Банкны шилжүүлэг';screenshot:string;total:number;status:Status;createdAt:string};
export const statuses:Status[]=['Хүлээгдэж байна','Төлбөр шалгаж байна','Бэлтгэж байна','Хүргэлтэнд гарсан','Хүргэгдсэн','Дууссан','Цуцлагдсан'];
export const rarities:Rarity[]=['Silver','Gold','Platinum','Rainbow'];
