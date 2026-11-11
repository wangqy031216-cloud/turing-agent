# Turing Agent 主页

Turing Agent 的长期维护主页：Harness 介绍、OpenAI 722 题中我们完成的题目、其他 demo、内部 workshop。
纯静态网站，没有构建步骤，push 到 `main` 后 GitHub Pages 自动更新（约 1 分钟）。

## 目录

```
index.html          首页（三个标签按钮，点击后内容在下方横向滑入）
harness.html        Harness 介绍 + benchmark 结果
openai.html         OpenAI 题目（左侧列表 + 右侧详情，支持搜索 / 按领域筛选）
demos.html          Demos：上方是证明轨迹回放（DAG 生长、Lean 探测、失败、压缩、经验，逐步播放），下方是其他 demo
traces.html         旧地址，自动跳转到 demos.html（保留是为了让以前分享出去的链接不失效）
workshops.html      内部研讨会（按日期自动分成 Upcoming / Archive）
page-template.html  新页面模板

data/               ← 日常维护基本只改这里
  site.js           顶部导航、首页 News、各种外链（报告 PDF / 代码仓库）
  openai.js         OpenAI 题目
  demos.js          demo
  workshops.js      研讨会
  results.js        benchmark 数据表
  traces/           证明轨迹（由 tools/extract_traces.py 生成，不要手改）
tools/
  extract_traces.py 把 proof-pipeline-observer 导出的原始轨迹压缩成网站用的小文件
assets/css/site.css 样式（颜色都是变量，深色模式自动适配）
assets/js/site.js   渲染逻辑（一般不用动）
assets/img/         图片
assets/video/       视频（GitHub 单文件上限 100 MB，建议控制在 20 MB 以内）
```

## 常见操作

| 想做的事 | 改哪里 |
|---|---|
| 加一道 OpenAI 题 | `data/openai.js`，复制一个对象改字段；只有 `slug / title / status / summary` 必填，其余字段没有就不显示 |
| 更新顶部漏斗数字（722 / 121 / 99 / 22 / 4） | `data/openai.js` 里的 `funnel` |
| 加一个非轨迹的 demo | `data/demos.js`，文件顶部有模板；会出现在 Demos 页下方的 More demos（列表为空时该区块自动隐藏）|
| 加一期 workshop | `data/workshops.js`，文件顶部有带注释的模板；slides 等文件可以放 `files/workshops/` |
| 首页加一条 News | `data/site.js` 的 `news`，加在最前面 |
| 挂上报告 PDF / 代码链接 | `data/site.js` 的 `links.report` / `links.code`，填了 URL 按钮就会出现 |
| 加一个新页面 | 复制 `page-template.html`，再在 `data/site.js` 的 `nav` 里加一行，顶部 banner 自动出现 |
| 更新 benchmark 数字 | `data/results.js` |
| 换首页展示视频 | mp4 放 `assets/video/`，封面图放 `assets/img/`，改 `index.html` 里 `SHOWCASE VIDEO` 段的 `src` / `poster` / 说明文字 |
| 给某道 OpenAI 题加视频 | 该题对象里加 `video: { src, poster, caption }` |
| 改首页三个标签里的内容 | `index.html` 里 `EXPLORE` 段，每个 `<section role="tabpanel">` 就是一个面板；第 2、3 个面板的卡片分别来自 `data/openai.js` 和 `data/traces/index.js` |
| 加一条证明轨迹 | 见下面「证明轨迹」 |

### 写数学公式

`data/openai.js` 的文字字段支持 HTML 和 KaTeX：行内 `$...$`，独立公式 `\[...\]`。

- 带反斜杠的文字用 `` String.raw`...` `` 包起来（现有条目都是这么写的）。
- 公式里的小于号写成 `&lt;`（例如 `$j&lt;d$`），否则浏览器会把 `<d` 当成 HTML 标签。
- `String.raw` 里不要出现 `$` 紧跟 `{` 这两个字符。

### 单独链接到某道题

`openai.html#<slug>` 或 `openai.html#<题号>`，例如 `openai.html#random-3sat`、`openai.html#186-01`。

## 证明轨迹

`demos.html` 顶部的轨迹回放读取 `data/traces/`。这些文件由脚本从 proof-pipeline-observer 的原始导出（`data/runs/<id>.json.gz`，单个可达上百 MB）提炼而来：
只保留 DAG 节点（声明、Lean 语句、证明体、依赖）、时间线（探测 / 失败 / 证明 / 压缩 / 经验 / 计划被放弃）和统计数字，单条轨迹约 10–130 KB。

加一条新轨迹：

1. 在 `tools/extract_traces.py` 顶部 `RUNS` 里加一项（`id` 要和导出文件名一致，标题 / 简介写给访客看的英文）。
2. 运行：

```bash
python3 tools/extract_traces.py /path/to/proof-pipeline-observer/data/runs
```

3. 提交 `data/traces/` 的改动。首页第三个标签和 Demos 页的回放器都会自动出现这条轨迹。

单独链接到某条轨迹：`demos.html#<id>`，例如 `demos.html#openai-math-186-ds`。

## 本地预览

```bash
python3 -m http.server 8000
```

然后打开 http://localhost:8000 。（直接双击 html 也能看，但部分浏览器会限制本地文件。）

## 图片

报告里的 PDF 图用 poppler 转成 PNG 再转 WebP（体积约为 PNG 的 1/4）：

```bash
pdftocairo -png -r 200 -singlefile figs/xxx.pdf xxx
python3 -c "from PIL import Image; Image.open('xxx.png').convert('RGB').save('assets/img/xxx.webp', 'WEBP', quality=88, method=6)"
```
