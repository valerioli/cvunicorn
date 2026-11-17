import config from './template.config.mjs';
export const {groups,calm}=config;
export function candidates(a){if(a.length!==config.questions.length||a.some(x=>!Number.isInteger(x)||x<0||x>4))throw new Error('请先完成全部八题');return groups.filter(g=>g.items.some(i=>a[i]>=3));}
export function pickResult(a,id){const c=candidates(a);if(!c.length)return calm;const found=c.find(g=>g.id===id);if(!found)throw new Error('请选一个最想改善的场景');return found;}
