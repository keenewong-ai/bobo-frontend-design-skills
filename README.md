# BoBo Front-end Design Skills

前端設計 skill 知識庫（靜態站）。每個 skill **必須**有非空 `description`。

**Pages:** https://keenewong-ai.github.io/bobo-frontend-design-skills/

**Repo:** https://github.com/keenewong-ai/bobo-frontend-design-skills

## 點用

- 列表：[`index.html`](./index.html) — 顯示 id、title、description、tags；可篩 category / 搜尋
- 詳情：`skills/<id>/`（例如 [`skills/tab-bar-ripple-fill/`](./skills/tab-bar-ripple-fill/)）或 `skill.html?id=<id>`
- 資料：[`data/skills.json`](./data/skills.json) — 加 skill 以改 JSON 為主（data-only）
- Demo：[`demos/`](./demos/) — 純 CSS/JS，無重框架

## Schema（required）

每個 skill entry 必填：

| Field | 說明 |
|-------|------|
| `id` | kebab-case 穩定 id |
| `title` | 顯示名稱 |
| `description` | **必填**一句／短段英文描述（列表同 UpdateSkill 對齊） |
| `category` | 例如 `tab-bar` |
| `whenToApply` | 幾時用（array） |
| `visualSpec` | 視覺規格（object） |
| `cssNotes` | CSS／互動要點（array） |
| `dontDo` | 唔好做咩（array） |

建議／可選：`summary`、`tags`、`categoryLabel`、`variants`、`steps`、`sections`（標明各段用途）、`mechanism`、`demo`、`source`、`priority`。

視覺／時序若非從 production 量度，請標 **suggested defaults**（現行 Personal OS bottom-nav 仍係簡單 active color swap；呢度係目標 library）。

## Seed skills（Tab Bar · Part 2）

1. `tab-bar-worm-underline` — Worm Underline  
2. `tab-bar-hopping-dot` — Hopping Dot  
3. `tab-bar-spotlight` — Spotlight  
4. `tab-bar-ripple-fill` — Ripple Fill (**priority**)  
5. `tab-bar-jelly-icon` — Jelly Icon  
6. `tab-bar-badge-pop` — Badge Pop  

Source：Personal OS demos reel（Tab Bar · タブの切り替え · Part 2）。

### Ripple Fill 重點

- 機制：tap → ripple 由 icon 中心擴展填滿 rounded-square；**舊 active 原地淡出**（唔滑走）
- Variant A（reel）：`#8B5CF6` → `#22D3EE`，暗色 bar  
- Variant B（Personal OS green）：`#89E219` → `#58CC02`，6 tabs（今日／目標／課程／日曆／收件／更多）+ Uicons  

Demo：[`demos/tab-bar-ripple-fill.html`](./demos/tab-bar-ripple-fill.html)



## Seed skills（Tab Bar · Part 1）

來源：[Instagram reel DfLt74CjduQ](https://www.instagram.com/reel/DfLt74CjduQ/) · ui_motion_prompts · タブの切り替えの演出 その1。

1. `tab-bar-sliding-pill` — Sliding Pill  
2. `tab-bar-liquid-bulge` — Liquid Bulge  
3. `tab-bar-floating-notch` — Floating Notch  
4. `tab-bar-icon-fill` — Icon Fill  
5. `tab-bar-expanding-label` — Expanding Label  
6. `tab-bar-bubble-float` — Bubble Float  

本地參考：`refs/reel-DfLt74CjduQ/`（frames + reel.mp4）。

## Local preview

```bash
cd /workspace/bobo-frontend-design-skills
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

## CONTRIBUTING

1. 喺 `data/skills.json` 加／改 entry（**description 唔可以空**）
2. 如有 demo，放 `demos/<id>.html` 並喺 entry 設 `"demo"`
3. 跑一次檢查：每個 skill 都有非空 `description`、`id` kebab-case
4. 可選：加 `skills/<id>/index.html`（或重跑產生 script）方便 Pages 路徑
5. PR / push `main`；GitHub Pages 由 `main` 根目錄發佈

## License

Docs／demo code for BoBo / keenewong-ai internal design skill library. Reel patterns documented for implementation reference.
