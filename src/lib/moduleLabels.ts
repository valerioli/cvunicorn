import type { ModuleDef, ModuleId } from "./intake";
const zh: Record<ModuleId, [string,string,string]> = {
 photos:["照片与图片","展示活动、人物与工作现场，形成清晰的视觉印象。","照片"],
 projects:["项目","介绍你做过的项目、你的贡献和结果。","项目"],
 portfolio:["作品集","选择最能代表你的作品，并补充背景。","作品"],
 articles:["文章与发表内容","展示你的写作、观点与专业积累。","文章"],
 social:["社交主页","提供希望公开展示的社交链接。","主页"],
 press:["媒体报道","添加来自媒体、播客或采访的报道。","报道"],
 testimonials:["推荐语","保留推荐人的原话、姓名与身份。","推荐语"],
 talks:["演讲与活动","补充演讲主题、活动、时间和材料。","演讲"],
 awards:["奖项与证书","提供名称、颁发机构及时间。","奖项"],
 caseStudies:["案例研究","说明问题、你的做法和真实结果。","案例"],
 videos:["视频与媒体出镜","添加访谈、演讲或作品的视频链接。","视频"],
 research:["研究与专利","补充论文、期刊、作者、DOI 或专利信息。","研究"],
 launches:["产品发布与业务成果","说明成果发生在哪里、何时以及你的贡献。","成果"],
 other:["其他经历","补充创作、志愿活动或其他值得分享的经历。","经历"],
};
const fields: Record<string,string>={caption:"图片说明",name:"项目名称",title:"标题",description:"介绍与意义",link:"链接",context:"背景与角色",outlet:"发布平台 / 媒体",summary:"简短摘要",platform:"平台",url:"主页链接",stat:"受众规模",date:"时间",quote:"推荐原文",author:"推荐人",role:"身份 / 职位",event:"活动 / 场地",issuer:"颁发机构",year:"年份",problem:"问题",approach:"你的做法",result:"结果",venue:"期刊 / 会议 / 专利机构",authors:"作者",headline:"成果"};
export function localizeModule(m:ModuleDef,language:string):ModuleDef {
 if(language!=="zh")return m;
 const [title,blurb,entryNoun]=zh[m.id];
 return {...m,title,blurb,entryNoun,example:undefined,fileHint:m.allowFiles?"图片或 PDF，每个文件不超过 4MB。":undefined,fields:m.fields.map(f=>({...f,label:fields[f.key]??f.label,placeholder:f.type==="url"?"https://…":undefined}))};
}
