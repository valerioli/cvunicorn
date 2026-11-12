export type Localized = {
  en: string;
  zh: string;
};

export type ShowcaseSite = {
  name: string;
  role: Localized;
  url: string;
  live: boolean;
  summary: Localized;
  sections: Localized[];
  highlights: Localized[];
  materials: Localized;
};

export type GeneratedCaseSite = {
  slug: string;
  name: string;
  style: SiteStyleOption["id"];
  heroImage?: string;
  externalUrl: string;
  role: Localized;
  industry: Localized;
  goal: Localized;
  result: Localized;
  metric: Localized;
  accent: string;
  accentSoft: string;
  sections: Localized[];
  materials: Localized;
  site: {
    eyebrow: Localized;
    headline: Localized;
    subhead: Localized;
    stats: { value: string; label: Localized }[];
    chapters: { title: Localized; body: Localized }[];
    works: { title: Localized; meta: Localized; body: Localized }[];
    proof: Localized[];
    quote: Localized;
  };
};

export type SiteStyleOption = {
  id: "valerio" | "resend" | "mercury" | "notion" | "active";
  name: string;
  source: string;
  description: Localized;
};

export const siteStyleOptions: SiteStyleOption[] = [
  {
    id: "valerio",
    name: "Modern Editorial",
    source: "valerioli/portfolio-site",
    description: {
      en: "Paper, mono type, oversized serif headlines, black rules, lime highlights, and editorial work sections.",
      zh: "纸张底色、等宽字体、超大 serif 标题、黑色粗线、lime 高亮和杂志式工作板块。",
    },
  },
  {
    id: "resend",
    name: "Resend Minimal",
    source: "Refero / Resend",
    description: {
      en: "Precise black-and-white SaaS minimalism with compact proof blocks and crisp hierarchy.",
      zh: "精确的黑白极简 SaaS 风格，紧凑证据模块和清晰层级。",
    },
  },
  {
    id: "mercury",
    name: "Mercury Fintech",
    source: "Refero / Mercury",
    description: {
      en: "Alpine blue finance atmosphere with calm panels, ledger rhythm, and trustworthy metrics.",
      zh: "蓝调金融气质，冷静面板、账本节奏和高信任度数据呈现。",
    },
  },
  {
    id: "notion",
    name: "Notion Workspace",
    source: "Refero / Notion",
    description: {
      en: "Document-like workspace clarity with warm paper, organized blocks, and human writing.",
      zh: "像工作区文档一样清晰，温暖纸面、有序块结构和更有人味的文字。",
    },
  },
  {
    id: "active",
    name: "Active Theory Cinematic",
    source: "Refero / Active Theory",
    description: {
      en: "Dark cinematic portfolio energy with luminous type, motion-ready panels, and a stronger visual signature.",
      zh: "暗色电影感作品集风格，发光文字、运动感面板和更强视觉签名。",
    },
  },
];

export const caseStudySites: GeneratedCaseSite[] = [
  {
    slug: "valerio-li",
    name: "Valerio Li",
    style: "valerio",
    heroImage: "https://raw.githubusercontent.com/valerioli/portfolio-site/main/headshot.jpg",
    externalUrl: "https://valerio.cvunicorn.com",
    role: {
      en: "Independent Builder, Questant",
      zh: "Questant 独立构建者",
    },
    industry: { en: "Growth leadership", zh: "增长与品牌领导力" },
    goal: {
      en: "Turn a multi-industry career across luxury, Web3, and AI into one coherent executive profile.",
      zh: "把横跨奢侈品、Web3 与 AI 的多行业经历，整理成一个清晰的高管个人网站。",
    },
    result: {
      en: "A six-section personal magazine with career metrics, field notes, writing, side projects, and a sharp executive close.",
      zh: "生成一个六段式个人杂志网站，包含职业成果、现场记录、文章、副项目和高管简介。",
    },
    metric: { en: "Infini: 50,000+ users", zh: "Infini：增长至 50,000+ 用户" },
    accent: "#533afd",
    accentSoft: "#e8e9ff",
    sections: [
      { en: "Work", zh: "工作经历" },
      { en: "Field", zh: "现场记录" },
      { en: "Vibe Coding", zh: "AI 实验" },
      { en: "Writings", zh: "文章" },
    ],
    materials: {
      en: "Full CV · career metrics · keynote photos · published articles · side projects · fiction writing",
      zh: "完整简历 · 职业数据 · 演讲照片 · 已发表文章 · 副项目 · 小说写作",
    },
    site: {
      eyebrow: { en: "Building Questant · AI, content & growth", zh: "Questant · AI 产品、内容与增长" },
      headline: {
        en: "Building narratives that move markets, products, and people.",
        zh: "打造能够推动市场、产品与人的叙事。",
      },
      subhead: {
        en: "From luxury digital growth and Pay-Fi brand building to Questant, Valerio connects AI products, content, and commercial growth.",
        zh: "从奢侈品数字化、Pay-Fi 品牌建设到 Questant，连接 AI 产品、内容与商业增长。",
      },
      stats: [
        { value: "$30M", label: { en: "year-one digital revenue", zh: "首年数字业务收入" } },
        { value: "50k+", label: { en: "fintech users scaled", zh: "金融科技用户增长" } },
        { value: "6", label: { en: "career story sections", zh: "职业叙事板块" } },
      ],
      chapters: [
        {
          title: { en: "Luxury to AI", zh: "从奢侈品到 AI" },
          body: {
            en: "A cross-market operating story, organized as chapters instead of resume bullets.",
            zh: "跨市场操盘经历被整理成章节，而不是简历条目。",
          },
        },
        {
          title: { en: "Field diary", zh: "现场档案" },
          body: {
            en: "Keynotes, launches, and partner moments become visual proof of leadership.",
            zh: "演讲、发布会和合作现场成为领导力的视觉证明。",
          },
        },
      ],
      works: [
        {
          title: { en: "Pay-Fi category narrative", zh: "Pay-Fi 品类叙事" },
          meta: { en: "Narrative system · APAC / LATAM", zh: "叙事系统 · 亚太 / 拉美" },
          body: {
            en: "A modular messaging system for executive decks, launch pages, and partner roadshows.",
            zh: "为高管演示、发布页和合作路演搭建模块化信息系统。",
          },
        },
        {
          title: { en: "Luxury digital launch", zh: "奢侈品数字业务发布" },
          meta: { en: "Growth launch · $30M year one", zh: "增长发布 · 首年 3000 万美元" },
          body: {
            en: "A commerce story that tied retail service, cultural moments, and digital revenue into one launch arc.",
            zh: "把零售服务、文化事件和数字收入整合成一条完整发布叙事。",
          },
        },
        {
          title: { en: "Questant: hands-on AI product", zh: "Questant：亲手构建 AI 产品" },
          meta: { en: "Writing · talks · experiments", zh: "写作 · 演讲 · 实验" },
          body: {
            en: "An independently built AI learning product spanning product design, content workflows, and acquisition.",
            zh: "独立构建 AI 学习产品，亲自参与产品设计、内容工作流与获客。",
          },
        },
      ],
      proof: [
        { en: "Created the global Pay-Fi narrative across multiple languages.", zh: "建立多语言的 Pay-Fi 全球叙事。" },
        { en: "Built a luxury brand's digital business to $30M revenue in year one.", zh: "推动某奢侈品牌数字业务首年达到 3000 万美元收入。" },
        { en: "Documented keynotes and activations as a visual field diary.", zh: "将演讲和品牌活动整理为可浏览的视觉现场档案。" },
      ],
      quote: {
        en: "The result feels less like a portfolio and more like a boardroom-ready profile.",
        zh: "最终效果不像作品集，更像一份可以直接进入会议室的高管资料。",
      },
    },
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    style: "mercury",
    heroImage: "/cases/maya-chen-hero.webp",
    externalUrl: "https://mayachen.cvunicorn.com",
    role: {
      en: "Fractional CFO for climate startups",
      zh: "气候科技创业公司的外部 CFO",
    },
    industry: { en: "Finance leadership", zh: "财务领导力" },
    goal: {
      en: "Turn a dense consulting resume into a founder-friendly credibility site before investor meetings.",
      zh: "在投资人会议前，把密集的咨询履历变成创始人也能快速理解的信任网站。",
    },
    result: {
      en: "A boardroom-style site with a deal timeline, finance playbooks, and client-ready proof points.",
      zh: "生成一个董事会风格网站，包含交易时间线、财务方法论和客户可信证据。",
    },
    metric: { en: "18 investor intros booked", zh: "预约 18 次投资人引荐" },
    accent: "#533afd",
    accentSoft: "#e8e9ff",
    sections: [
      { en: "Board bio", zh: "董事会简介" },
      { en: "Deal timeline", zh: "交易时间线" },
      { en: "Operator notes", zh: "操盘笔记" },
      { en: "Client proof", zh: "客户证据" },
    ],
    materials: {
      en: "Resume · anonymized deal sheet · speaking photos · finance essays · testimonials",
      zh: "简历 · 匿名交易表 · 演讲照片 · 财务文章 · 推荐语",
    },
    site: {
      eyebrow: { en: "Finance strategy for climate operators", zh: "面向气候科技团队的财务战略" },
      headline: {
        en: "Finance leadership that gives founders room to build.",
        zh: "让创始人能安心建设公司的财务领导力。",
      },
      subhead: {
        en: "Maya's site reframes finance work as a calm operating system: fundraising, runway, governance, and board clarity.",
        zh: "Maya 的网站把财务工作呈现为稳定的运营系统：融资、现金流、治理和董事会沟通。",
      },
      stats: [
        { value: "18", label: { en: "investor intros", zh: "投资人引荐" } },
        { value: "$42M", label: { en: "capital planned", zh: "规划融资规模" } },
        { value: "11", label: { en: "startup engagements", zh: "创业公司项目" } },
      ],
      chapters: [
        {
          title: { en: "Fundraising readiness", zh: "融资准备" },
          body: { en: "Investor materials, runway models, and board narratives presented as a timeline.", zh: "投资材料、现金流模型和董事会叙事以时间线呈现。" },
        },
        {
          title: { en: "Operating cadence", zh: "运营节奏" },
          body: { en: "A practical view of how finance becomes decision infrastructure.", zh: "展示财务如何成为决策基础设施。" },
        },
      ],
      works: [
        {
          title: { en: "Series A readiness model", zh: "A 轮融资准备模型" },
          meta: { en: "Runway · hiring plan · investor memo", zh: "现金流 · 招聘计划 · 投资人备忘录" },
          body: {
            en: "A founder-facing model that connected runway scenarios, hiring gates, and milestone-based capital needs.",
            zh: "把现金流场景、招聘节奏和里程碑融资需求连接成创始人能用的模型。",
          },
        },
        {
          title: { en: "Climate hardware margin map", zh: "气候硬件毛利地图" },
          meta: { en: "Unit economics · board review", zh: "单位经济模型 · 董事会复盘" },
          body: {
            en: "A visual board pack that explained margin pressure across supply, deployment, and support.",
            zh: "用可视化董事会材料解释供应、部署和支持环节的毛利压力。",
          },
        },
        {
          title: { en: "Investor operating cadence", zh: "投资人运营节奏" },
          meta: { en: "Monthly reporting · trust system", zh: "月度汇报 · 信任系统" },
          body: {
            en: "A reporting rhythm that made progress legible before each investor call.",
            zh: "建立每月汇报节奏，让投资人会议前就能看懂进展。",
          },
        },
      ],
      proof: [
        { en: "Built reporting systems for Seed to Series B climate teams.", zh: "为种子轮到 B 轮气候科技团队搭建汇报系统。" },
        { en: "Translated complex finance work into founder-ready pages.", zh: "把复杂财务工作翻译成创始人易懂的页面。" },
        { en: "Positioned advisory work without exposing client-sensitive details.", zh: "在不暴露客户敏感信息的前提下呈现顾问成果。" },
      ],
      quote: {
        en: "The site feels like proof before the first call starts.",
        zh: "第一次通话开始之前，这个网站就已经完成了一部分信任建立。",
      },
    },
  },
  {
    slug: "noah-rivera",
    name: "Noah Rivera",
    style: "resend",
    heroImage: "/cases/noah-rivera-hero.webp",
    externalUrl: "https://noahrivera.cvunicorn.com",
    role: {
      en: "Senior product designer, health AI",
      zh: "健康 AI 资深产品设计师",
    },
    industry: { en: "Design portfolio", zh: "设计作品集" },
    goal: {
      en: "Show product depth without exposing confidential client work or reducing everything to screenshots.",
      zh: "在不暴露保密项目的情况下，展示产品思考深度，而不是只堆截图。",
    },
    result: {
      en: "A design portfolio with case-study narratives, process artifacts, constraints, and measurable outcomes.",
      zh: "生成一个设计作品集网站，用案例叙事呈现过程、约束和可衡量结果。",
    },
    metric: { en: "4 interview loops in 9 days", zh: "9 天进入 4 个面试流程" },
    accent: "#00a88f",
    accentSoft: "#dff7f2",
    sections: [
      { en: "Selected work", zh: "精选项目" },
      { en: "Process", zh: "设计过程" },
      { en: "Systems", zh: "系统设计" },
      { en: "Writing", zh: "写作" },
    ],
    materials: {
      en: "Portfolio PDF · project blurbs · Figma exports · product metrics · conference bio",
      zh: "作品集 PDF · 项目简介 · Figma 导出 · 产品指标 · 会议简介",
    },
    site: {
      eyebrow: { en: "Designing trust in clinical AI", zh: "为临床 AI 设计信任感" },
      headline: {
        en: "Interfaces for high-stakes decisions, shaped with restraint.",
        zh: "为高风险决策设计克制、可信的界面。",
      },
      subhead: {
        en: "Noah's site turns confidential product work into explainable design stories: context, tradeoffs, systems, and outcomes.",
        zh: "Noah 的网站把保密产品工作转化为可解释的设计故事：背景、取舍、系统和结果。",
      },
      stats: [
        { value: "4", label: { en: "interview loops", zh: "面试流程" } },
        { value: "28%", label: { en: "workflow time saved", zh: "流程时间节省" } },
        { value: "3", label: { en: "design systems shipped", zh: "上线设计系统" } },
      ],
      chapters: [
        {
          title: { en: "Case study without leaks", zh: "不泄密的案例" },
          body: { en: "Sensitive visuals become structured problem, process, and outcome sections.", zh: "敏感视觉材料被转化成问题、过程和结果结构。" },
        },
        {
          title: { en: "Systems thinking", zh: "系统思维" },
          body: { en: "Components, decision states, and clinical edge cases are shown as design judgment.", zh: "组件、决策状态和临床边界情况被呈现为设计判断。" },
        },
      ],
      works: [
        {
          title: { en: "Clinical triage workspace", zh: "临床分诊工作台" },
          meta: { en: "Health AI · workflow redesign", zh: "健康 AI · 工作流重设计" },
          body: {
            en: "A decision surface that reduced context switching for clinicians while preserving auditability.",
            zh: "减少临床人员切换上下文，同时保留可审计性的决策界面。",
          },
        },
        {
          title: { en: "Explainability states", zh: "可解释性状态" },
          meta: { en: "Design system · risk language", zh: "设计系统 · 风险语言" },
          body: {
            en: "A component set for confidence, uncertainty, escalation, and human override moments.",
            zh: "为置信度、不确定性、升级处理和人工接管设计组件系统。",
          },
        },
        {
          title: { en: "Patient operations map", zh: "患者运营地图" },
          meta: { en: "Service design · 28% time saved", zh: "服务设计 · 节省 28% 时间" },
          body: {
            en: "A journey model that connected patient intake, AI recommendations, and staff handoffs.",
            zh: "连接患者录入、AI 建议和工作人员交接的旅程模型。",
          },
        },
      ],
      proof: [
        { en: "Reframed product work for hiring managers and design leads.", zh: "为招聘经理和设计负责人重新组织产品设计经历。" },
        { en: "Kept confidential screenshots out while preserving credibility.", zh: "不展示保密截图，同时保留可信度。" },
        { en: "Connected product metrics directly to design decisions.", zh: "将产品指标直接连接到设计决策。" },
      ],
      quote: {
        en: "It finally explains the thinking behind the work, not just the pixels.",
        zh: "它终于解释了作品背后的思考，而不只是展示像素。",
      },
    },
  },
  {
    slug: "ari-okafor",
    name: "Ari Okafor",
    style: "active",
    heroImage: "/cases/ari-okafor-hero.webp",
    externalUrl: "https://ariokafor.cvunicorn.com",
    role: {
      en: "Independent robotics researcher",
      zh: "独立机器人研究者",
    },
    industry: { en: "Research profile", zh: "研究者主页" },
    goal: {
      en: "Make publications, patents, prototypes, and teaching work feel like one coherent research identity.",
      zh: "把论文、专利、原型和教学经历整合成一个连贯的研究者身份。",
    },
    result: {
      en: "A research homepage with publication filters, prototype cards, lab notes, and a concise collaboration pitch.",
      zh: "生成一个研究主页，包含论文筛选、原型卡片、实验室笔记和合作说明。",
    },
    metric: { en: "3 lab partnership requests", zh: "收到 3 个实验室合作邀请" },
    accent: "#ff7a59",
    accentSoft: "#fff0ea",
    sections: [
      { en: "Research", zh: "研究" },
      { en: "Patents", zh: "专利" },
      { en: "Prototypes", zh: "原型" },
      { en: "Teaching", zh: "教学" },
    ],
    materials: {
      en: "Academic CV · papers · patent list · prototype videos · lab photography",
      zh: "学术简历 · 论文 · 专利列表 · 原型视频 · 实验室照片",
    },
    site: {
      eyebrow: { en: "Robotics research with human context", zh: "带有人文场景的机器人研究" },
      headline: {
        en: "Robots that learn from messy, real-world environments.",
        zh: "让机器人从真实而复杂的环境中学习。",
      },
      subhead: {
        en: "Ari's site organizes academic output into a clear collaboration surface for labs, founders, and grant partners.",
        zh: "Ari 的网站把学术成果组织成面向实验室、创始人和基金合作方的清晰合作入口。",
      },
      stats: [
        { value: "14", label: { en: "published papers", zh: "发表论文" } },
        { value: "5", label: { en: "robotics prototypes", zh: "机器人原型" } },
        { value: "3", label: { en: "lab requests", zh: "实验室邀约" } },
      ],
      chapters: [
        {
          title: { en: "Publication map", zh: "论文地图" },
          body: { en: "Research areas are grouped by theme so collaborators understand the arc quickly.", zh: "研究方向按主题归类，让合作方快速理解研究轨迹。" },
        },
        {
          title: { en: "Prototype gallery", zh: "原型图库" },
          body: { en: "Videos and lab imagery become compact cards with practical context.", zh: "视频和实验室图像变成带有实际场景说明的卡片。" },
        },
      ],
      works: [
        {
          title: { en: "Messy-room navigation", zh: "复杂房间导航" },
          meta: { en: "Prototype · embodied learning", zh: "原型 · 具身学习" },
          body: {
            en: "A mobile robot demo that learns from partial maps, blocked paths, and changing household objects.",
            zh: "移动机器人在局部地图、受阻路径和变化物体中学习导航。",
          },
        },
        {
          title: { en: "Human-in-the-loop grasping", zh: "人在回路中的抓取系统" },
          meta: { en: "Lab note · tactile policy", zh: "实验笔记 · 触觉策略" },
          body: {
            en: "A research prototype that blends tactile signals with lightweight human correction.",
            zh: "把触觉信号和轻量人工纠错结合的研究原型。",
          },
        },
        {
          title: { en: "Open lab teaching kit", zh: "开放实验教学套件" },
          meta: { en: "Teaching · robotics curriculum", zh: "教学 · 机器人课程" },
          body: {
            en: "A reproducible curriculum that lets small teams test robotics ideas without a full lab budget.",
            zh: "让小团队无需完整实验室预算也能验证机器人想法的可复现实验课程。",
          },
        },
      ],
      proof: [
        { en: "Presented patents and publications without academic clutter.", zh: "呈现专利和论文，但不堆砌学术信息。" },
        { en: "Made teaching and lab work part of one research identity.", zh: "让教学和实验室工作成为同一研究身份的一部分。" },
        { en: "Added a concise pitch for collaboration and grants.", zh: "加入清晰的合作与基金申请说明。" },
      ],
      quote: {
        en: "The page gives people the context they need before they read a single paper.",
        zh: "在读任何一篇论文前，页面已经给了访问者足够的背景。",
      },
    },
  },
];

export const showcaseSites: ShowcaseSite[] = [
  {
    name: caseStudySites[0].name,
    role: caseStudySites[0].role,
    url: `/case-study-sites/${caseStudySites[0].slug}`,
    live: true,
    summary: {
      en: "A marketing and growth leader spanning luxury retail, Web3, and AI. Valerio gave CVUnicorn a broad career archive and received a six-section personal magazine, not a resume page.",
      zh: "一位横跨奢侈品、Web3 与 AI 的营销增长负责人。Valerio 提供了完整职业材料，CVUnicorn 生成的是六段式个人杂志，而不是简历页面。",
    },
    sections: caseStudySites[0].sections,
    highlights: caseStudySites[0].site.proof,
    materials: caseStudySites[0].materials,
  },
];

export const featuredShowcase = showcaseSites[0];
