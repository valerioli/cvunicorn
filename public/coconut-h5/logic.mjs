import config from './template.config.mjs';
export const {groups,calm}=config;
export function pickResult(a){
 if(a.length!==config.questions.length||a.some(x=>!Number.isInteger(x)||x<0||x>=config.labels.length))throw new Error('请先完成所有题目');
 if(a.every(x=>x<config.resultPolicy.neutralWhenAllBelow))return calm;
 const ranked=groups.map((g,index)=>({g,index,sum:g.items.reduce((s,i)=>s+a[i],0),peak:Math.max(...g.items.map(i=>a[i]))}));
 ranked.sort((a,b)=>b.sum-a.sum||b.peak-a.peak||a.index-b.index);
 return ranked[0].g;
}
