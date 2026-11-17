# 椰子酱 H5 模板

正式入口：`https://adhd.questant.app/`。复用既有 cvunicorn Git → Vercel Production；`src/proxy.ts` 为 adhd.questant.app 改写静态白名单资源，旧 maths 主机永久跳转，主站与作品集逻辑保持。

## 可复用结构

- `public/coconut-h5/template.config.mjs`：题库（标题/场景/问题）、频率标签、结果分组、品牌、标准分享地址、配色、反馈短句和动效/声音参数。
- `app.js`：双语问答、回退、自动单结果、分享图。零网络答案提交、零浏览器答案持久化。
- `logic.mjs`：基于场景回答选择趣味称号；自动只取最接近的一个，不生成心理/医学概率。
- `effects.mjs`：选择反馈、短暂停滞、轻抖动、切题、结果盖章与单次低强度闪白。Web Audio 合成短音，不下载音频；默认静音，用户开启后才创建/恢复音频上下文。
- `style.css` / `motion.css`：奶油黄、墨蓝、珊瑚红的编辑漫画视觉。

后续换主题先复制这个目录，修改 config 和分享画布文案，再配置独立路由。题库必须是字符串数组，不能使用 PowerShell 对象序列化产生的 `{value,Count}` 包装；自动检查要断言每道题真实文字显示，不能只看按钮可点。

## 体验节奏

选择：约 72ms 停滞 + 140ms 短抖动，只作用于选项；切题：130ms 退出、240ms 进入，防连点；结果：620ms 工牌揭晓和盖章；闪白仅结果出现时单次 120ms、最高 0.22 透明度，相邻触发间隔至少 1.5 秒。系统减少动态效果或手动关闭动效后不运行空间动画/闪白，选中样式仍清晰。

## 交付检查

运行仓库 `npm test` / `npm run check` / `npm run build`。H5 浏览器检查需覆盖真实中文题面、禁用下一题、返回/改答、自动单结果、静音/开启、手动关闭动效、系统减少动态效果、分享 PNG、连续点击、重测清空、320/390/768/1280px 无溢出。生产验收同时检查根页面与所有 module/CSS 资源，不能仅检查 HTTP 200。

公众号入口用可编辑文案 + 独立视觉入口/二维码，绑定正式地址。公众号正文不能直接运行 JS；正文外链是否允许以账号后台实际验证为准，“阅读原文”与可识别二维码均需验收。只保存草稿，不自动发表文章。

## Bilingual pop-art edition (17 November 2026)
- Canonical: https://adhd.questant.app/; previous maths.cvunicorn.com redirects with path/query preserved.
- Main title always **BRAIN ON OVERTIME. / 脑子还没下班。** English is visually primary in both locales. Questions, results and exported passes always retain both title languages.
- `en.mjs` owns English transcreations; `template.config.mjs` owns Chinese scenes and scoring. Keep the same question order and underlying meaning. Translate situations and punchlines, not syntax.
- `?lang=en` opens English. Switching language preserves current question and all answers in memory. Refresh clears answers; neither locale stores or uploads answers.
- One result only: highest paired sum, then highest single answer, then stable configuration order. All answers below 3 get the neutral pass. These are entertainment titles, never diagnoses.
- Official Questant raster logo is unmodified. Bangers is self-hosted under its bundled OFL license. Keep both files in the host asset allowlist when reusing this template.
- Canvas waits for fonts and logo decode; exported copy follows locale while titles remain bilingual. Entry artwork and QR are rebuilt using `node scripts/coconut-entry.mjs`.
- Validation: Chinese and English complete flows, back/edit persistence, language switching, direct English links, one-result export, sound opt-in, reduced motion, responsive widths, existing host routing, TypeScript and Next production build.

