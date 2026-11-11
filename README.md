# Turing Agent 主页

Turing Agent 的长期维护主页：Harness 介绍、OpenAI 722 题中我们完成的题目、其他 demo、内部 workshop。
纯静态网站，没有构建步骤，push 到 `main` 后 GitHub Pages 自动更新（约 1 分钟）。

## 目录

```
index.html          首页
harness.html        Harness 介绍 + benchmark 结果
openai.html         OpenAI 题目（左侧列表 + 右侧详情，支持搜索 / 按领域筛选）
demos.html          其他 demo（卡片 + 分类筛选）
workshops.html      内部研讨会（按日期自动分成 Upcoming / Archive）
page-template.html  新页面模板

data/               ← 日常维护基本只改这里
  site.js           顶部导航、首页 News、各种外链（报告 PDF / 代码仓库）
  openai.js         OpenAI 题目
  demos.js          demo
  workshops.js      研讨会
  results.js        benchmark 数据表
assets/css/site.css 样式（颜色都是变量，深色模式自动适配）
assets/js/site.js   渲染逻辑（一般不用动）
assets/img/         图片
```

## 常见操作

| 想做的事 | 改哪里 |
|---|---|
| 加一道 OpenAI 题 | `data/openai.js`，复制一个对象改字段；只有 `slug / title / status / summary` 必填，其余字段没有就不显示 |
| 更新顶部漏斗数字（722 / 121 / 99 / 22 / 4） | `data/openai.js` 里的 `funnel` |
| 加一个 demo | `data/demos.js`，复制一个对象；`category` 填新值会自动多一个筛选按钮 |
| 加一期 workshop | `data/workshops.js`，文件顶部有带注释的模板；slides 等文件可以放 `files/workshops/` |
| 首页加一条 News | `data/site.js` 的 `news`，加在最前面 |
| 挂上报告 PDF / 代码链接 | `data/site.js` 的 `links.report` / `links.code`，填了 URL 按钮就会出现 |
| 加一个新页面 | 复制 `page-template.html`，再在 `data/site.js` 的 `nav` 里加一行，顶部 banner 自动出现 |
| 更新 benchmark 数字 | `data/results.js` |

### 写数学公式

`data/openai.js` 的文字字段支持 HTML 和 KaTeX：行内 `$...$`，独立公式 `\[...\]`。

- 带反斜杠的文字用 `` String.raw`...` `` 包起来（现有条目都是这么写的）。
- 公式里的小于号写成 `&lt;`（例如 `$j&lt;d$`），否则浏览器会把 `<d` 当成 HTML 标签。
- `String.raw` 里不要出现 `$` 紧跟 `{` 这两个字符。

### 单独链接到某道题

`openai.html#<slug>` 或 `openai.html#<题号>`，例如 `openai.html#random-3sat`、`openai.html#186-01`。

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
