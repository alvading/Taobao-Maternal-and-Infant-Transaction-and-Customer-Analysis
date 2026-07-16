"use client";

import { useMemo, useState } from "react";

type Language = "zh" | "en";
type Metric = "tradeRows" | "totalUnits" | "sensitivityUnits";

const repo =
  "https://github.com/alvading/Taobao-Maternal-and-Infant-Transaction-and-Customer-Analysis";

const monthly = {
  2013: [
    [629, 1372, 986], [318, 1177, 577], [738, 1094, 1094],
    [769, 1506, 1106], [985, 1864, 1664], [679, 1232, 1022],
    [678, 2662, 1256], [745, 1364, 1364], [967, 1956, 1506],
    [986, 1590, 1290], [1153, 2538, 1677], [1106, 4458, 1558],
  ],
  2014: [
    [763, 1109, 1109], [702, 1458, 1358], [1240, 2359, 1808],
    [1243, 2204, 2004], [1452, 3669, 2296], [1088, 1785, 1585],
    [1062, 2461, 1661], [1206, 3139, 1840], [1404, 5185, 2037],
    [1472, 3320, 2122], [1833, 13044, 2460], [1559, 2508, 2260],
  ],
};

const categories = [
  { id: "50008168", rows: 12494, raw: 18792, safe: 14811, growth: 39.33 },
  { id: "28", rows: 6963, raw: 28545, safe: 13659, growth: 24.38 },
  { id: "50014815", rows: 4834, raw: 19763, safe: 8535, growth: 17.57 },
  { id: "50022520", rows: 2367, raw: 3245, safe: 2945, growth: 9.13 },
  { id: "122650008", rows: 2110, raw: 2239, safe: 2239, growth: 7.55 },
  { id: "38", rows: 1203, raw: 3666, safe: 3566, growth: 2.05 },
];

const stageData = [
  ["Possible prenatal", "可能孕期", 11.42, 1.48],
  ["0–11 months", "0–11个月", 34.26, 1.39],
  ["12–23 months", "12–23个月", 21.62, 1.7],
  ["24–35 months", "24–35个月", 13.41, 1.3],
  ["36–71 months", "36–71个月", 19.29, 1.28],
] as const;

const copy = {
  zh: {
    nav: ["项目", "规模", "增长", "品类", "用户", "结论"],
    eyebrow: "SQL 数据分析 · 交互式案例研究",
    title: "淘宝母婴商品交易与用户消费分析",
    subtitle:
      "从29,971条交易出发，识别真实增长、拆解异常数量影响，并追踪推动业务变化的品类与用户结构。",
    read: "开始阅读故事",
    explore: "查看 GitHub",
    scope: "数据范围",
    scopeText: "2012-07-02 — 2015-02-05 · MySQL · 29,971条记录",
    question1: "01 · 数据是否足以支持分析？",
    heading1: "先定义可信边界，再谈业务增长",
    body1:
      "交易表完整且无完全重复行，但购买件数被65条大数量记录显著影响；人口属性只覆盖3.18%的交易用户。项目因此保留原始口径，并同步提供敏感性口径。",
    question2: "02 · 业务规模发生了什么变化？",
    heading2: "2014年的增长，主要来自更多购买用户",
    body2:
      "2014年交易记录同比增长54.04%，购买用户增长54.13%。两者几乎同步，而跨日复购率仅0.0802%，说明增长主要由用户规模扩大推动，而非购买频次提升。",
    chartTitle: "月度趋势",
    chartHint: "切换年份和指标，查看原始销量与敏感性口径的差异。",
    anomaly: "11月的真实高峰，被一条10,000件记录进一步放大",
    anomalyBody:
      "2014年11月交易记录和敏感性件数均为样本期第一；但原始13,044件中，单条10,000件记录占76.66%。",
    question3: "03 · 哪些品类推动增长？",
    heading3: "核心品类稳定，销量排名却会被大数量记录改变",
    body3:
      "50008168贡献41.69%的交易记录，是覆盖最广的一级品类；前三个品类合计贡献2013→2014年81.28%的交易增量。切换口径可看到原始销量排名如何变化。",
    categoryTitle: "一级品类表现",
    growthTitle: "2013→2014交易增长贡献",
    pareto: "长尾不是噪音",
    paretoBody:
      "662个细分类目中，需要123个才能累计贡献80%的交易。约18.58%的品类贡献80%，但Top 10仅占31.29%，呈现头部集中与长尾并存。",
    question4: "04 · 用户与人口属性告诉我们什么？",
    heading4: "复购信号极弱，人口属性只能作为补充",
    body4:
      "29,944名购买用户中，仅24名发生跨日复购。婴儿信息匹配953名用户，且出生日期存在极端值，因此阶段与性别结论只描述匹配子样本。",
    stageTitle: "合理窗口内的购买阶段",
    genderTitle: "匹配用户性别结构",
    question5: "05 · 最终结论",
    heading5: "增长是真实的，但必须用双口径解释",
    conclusion: [
      "2014年全年交易活跃度普遍增长，核心动力是购买用户扩大。",
      "原始件数增长85.16%，其中61.70%的增量来自单笔100件及以上记录。",
      "50008168是最稳定的核心品类，前三个品类贡献81.28%的交易增长。",
      "数据适合趋势和品类分析，不适合复杂RFM、复购预测或总体人口推断。",
    ],
    method: "方法与可复现性",
    methodBody:
      "所有指标均来自经过验证的MySQL成品查询。原始数据不进入仓库；公开项目保留双语方法、质量审计、SQL和聚合结果。",
    sql: "查看对应 SQL",
    units: "件",
    rows: "交易记录",
    raw: "原始件数",
    safe: "敏感性件数",
    language: "EN",
  },
  en: {
    nav: ["Project", "Scale", "Growth", "Category", "Customer", "Findings"],
    eyebrow: "SQL ANALYTICS · INTERACTIVE CASE STUDY",
    title: "Taobao Maternal & Infant Transaction Analysis",
    subtitle:
      "Starting with 29,971 transactions, this case separates real growth from quantity distortion and traces the categories and customers behind the change.",
    read: "Start the story",
    explore: "View GitHub",
    scope: "DATA SCOPE",
    scopeText: "2012-07-02 — 2015-02-05 · MySQL · 29,971 rows",
    question1: "01 · Is the data fit for analysis?",
    heading1: "Define the evidence boundary before discussing growth",
    body1:
      "The trade table reconciles with no exact duplicates, but 65 high-quantity rows materially affect unit metrics. Demographics cover only 3.18% of purchasing users, so raw and sensitivity views are reported together.",
    question2: "02 · What changed in business scale?",
    heading2: "2014 growth came primarily from more purchasing users",
    body2:
      "Trade rows grew 54.04% and purchasing users 54.13% in 2014. With a cross-day repeat rate of only 0.0802%, expansion reflects user acquisition rather than higher purchase frequency.",
    chartTitle: "Monthly trend",
    chartHint: "Switch year and metric to compare raw units with the sensitivity view.",
    anomaly: "A real November peak, amplified by one 10,000-unit row",
    anomalyBody:
      "November 2014 ranks first for both trade rows and sensitivity units, yet one 10,000-unit row represents 76.66% of its 13,044 raw units.",
    question3: "03 · Which categories drove growth?",
    heading3: "The core category is stable, while raw-unit ranks are not",
    body3:
      "50008168 contributes 41.69% of trade rows. The top three categories supply 81.28% of 2013→2014 row growth. Switch metrics to see how high quantities reshape rankings.",
    categoryTitle: "Top-level category performance",
    growthTitle: "Contribution to 2013→2014 row growth",
    pareto: "The long tail still matters",
    paretoBody:
      "Of 662 detailed categories, 123 are required to reach 80% of rows. About 18.58% supply 80%, while the Top 10 account for only 31.29%—head concentration and a substantial tail coexist.",
    question4: "04 · What do customers and demographics reveal?",
    heading4: "Repeat signals are weak; demographics are supplementary",
    body4:
      "Only 24 of 29,944 purchasing users buy on multiple dates. Baby information matches 953 users and includes extreme birth dates, so stage and gender findings describe only the matched subsample.",
    stageTitle: "Purchase stage within the plausible window",
    genderTitle: "Gender mix of matched users",
    question5: "05 · Final findings",
    heading5: "Growth is real, but requires a dual-metric explanation",
    conclusion: [
      "Transaction activity increased throughout 2014, driven by more purchasing users.",
      "Raw units grew 85.16%; high-quantity rows supplied 61.70% of the increase.",
      "50008168 is the most stable core category; the top three drive 81.28% of row growth.",
      "The data supports trend and category analysis, not complex RFM, repeat prediction, or population-level demographic claims.",
    ],
    method: "METHOD & REPRODUCIBILITY",
    methodBody:
      "Every metric traces to validated MySQL queries. Raw data remains outside the repository; the public project contains bilingual methods, quality audits, SQL, and aggregated results.",
    sql: "View SQL",
    units: "units",
    rows: "Trade rows",
    raw: "Raw units",
    safe: "Sensitivity units",
    language: "中",
  },
};

const metricIndex: Record<Metric, number> = {
  tradeRows: 0,
  totalUnits: 1,
  sensitivityUnits: 2,
};

function format(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function Home() {
  const [lang, setLang] = useState<Language>("zh");
  const [year, setYear] = useState<2013 | 2014>(2014);
  const [metric, setMetric] = useState<Metric>("tradeRows");
  const [categoryMetric, setCategoryMetric] = useState<Metric>("tradeRows");
  const t = copy[lang];

  const values = useMemo(
    () => monthly[year].map((row) => row[metricIndex[metric]]),
    [year, metric],
  );
  const maxValue = Math.max(...values);
  const categoryValues = categories.map((item) =>
    categoryMetric === "tradeRows"
      ? item.rows
      : categoryMetric === "totalUnits"
        ? item.raw
        : item.safe,
  );
  const maxCategory = Math.max(...categoryValues);
  const metricLabel =
    metric === "tradeRows" ? t.rows : metric === "totalUnits" ? t.raw : t.safe;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#project" aria-label="Back to project introduction">
          <span>AD</span>
          <strong>DATA CASE / 01</strong>
        </a>
        <nav aria-label="Story chapters">
          {t.nav.map((label, index) => (
            <a key={label} href={`#chapter-${index}`}>{label}</a>
          ))}
        </nav>
        <button className="language" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
          {t.language}
        </button>
      </header>

      <section className="hero" id="project">
        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="dek">{t.subtitle}</p>
          <div className="hero-actions">
            <a className="primary" href="#chapter-1">{t.read}</a>
            <a className="text-link" href={repo} target="_blank" rel="noreferrer">{t.explore} ↗</a>
          </div>
        </div>
        <div className="hero-number" aria-label="29,971 transaction rows">
          <small>TRADE ROWS</small>
          <strong>29,971</strong>
          <div className="number-rule"><span /></div>
          <p>{t.scope}</p>
          <em>{t.scopeText}</em>
        </div>
      </section>

      <div className="story-layout">
        <aside className="chapter-rail" aria-label="Story progress">
          <span className="rail-label">STORY</span>
          {t.nav.slice(1).map((label, index) => (
            <a key={label} href={`#chapter-${index + 1}`}>
              <i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span>
            </a>
          ))}
        </aside>

        <div className="story">
          <section className="chapter intro-chapter" id="chapter-0">
            <div className="chapter-copy">
              <p className="chapter-kicker">{t.question1}</p>
              <h2>{t.heading1}</h2>
              <p>{t.body1}</p>
            </div>
            <div className="evidence-grid">
              <article><strong>29,971</strong><span>{t.rows}</span><small>0 exact duplicates</small></article>
              <article><strong>65</strong><span>≥100 {t.units}</span><small>39.99% of raw units</small></article>
              <article><strong>3.18%</strong><span>Demographic coverage</span><small>953 matched users</small></article>
            </div>
          </section>

          <section className="chapter" id="chapter-1">
            <div className="chapter-copy split-copy">
              <div>
                <p className="chapter-kicker">{t.question2}</p>
                <h2>{t.heading2}</h2>
              </div>
              <p>{t.body2}</p>
            </div>
            <div className="stat-strip">
              <article><span>2014 TRADE ROWS</span><strong>+54.04%</strong></article>
              <article><span>2014 USERS</span><strong>+54.13%</strong></article>
              <article><span>SENSITIVITY UNITS</span><strong>+49.27%</strong></article>
              <article className="quiet"><span>CROSS-DAY REPEAT</span><strong>0.0802%</strong></article>
            </div>

            <article className="chart-card">
              <div className="card-head">
                <div><p className="micro">02 / TIME</p><h3>{t.chartTitle}</h3><span>{t.chartHint}</span></div>
                <div className="controls">
                  <div className="segmented" aria-label="Choose year">
                    {[2013, 2014].map((item) => (
                      <button key={item} className={year === item ? "active" : ""} onClick={() => setYear(item as 2013 | 2014)}>{item}</button>
                    ))}
                  </div>
                  <div className="segmented metric-control" aria-label="Choose metric">
                    {(["tradeRows", "totalUnits", "sensitivityUnits"] as Metric[]).map((item) => (
                      <button key={item} className={metric === item ? "active" : ""} onClick={() => setMetric(item)}>
                        {item === "tradeRows" ? t.rows : item === "totalUnits" ? t.raw : t.safe}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bar-chart" role="img" aria-label={`${year} ${metricLabel} monthly bar chart`}>
                {values.map((value, index) => (
                  <div className={`bar-column ${year === 2014 && index === 10 ? "highlight" : ""}`} key={index}>
                    <span className="bar-value">{format(value)}</span>
                    <div className="bar" style={{ height: `${Math.max(5, (value / maxValue) * 100)}%` }} />
                    <small>{index + 1}</small>
                  </div>
                ))}
              </div>
              <div className="chart-axis"><span>JAN</span><em>{metricLabel}</em><span>DEC</span></div>
              {year === 2014 && (
                <div className="annotation">
                  <b>11</b><div><strong>{t.anomaly}</strong><p>{t.anomalyBody}</p></div>
                </div>
              )}
            </article>
            <a className="sql-link" href={`${repo}/blob/main/sql/05_time_trends.sql`} target="_blank" rel="noreferrer">{t.sql} · 05_time_trends.sql ↗</a>
          </section>

          <section className="chapter" id="chapter-2">
            <div className="chapter-copy split-copy">
              <div><p className="chapter-kicker">{t.question3}</p><h2>{t.heading3}</h2></div>
              <p>{t.body3}</p>
            </div>
            <div className="category-layout">
              <article className="category-card">
                <div className="card-head compact">
                  <div><p className="micro">03 / CATEGORY</p><h3>{t.categoryTitle}</h3></div>
                  <div className="segmented metric-control">
                    {(["tradeRows", "totalUnits", "sensitivityUnits"] as Metric[]).map((item) => (
                      <button key={item} className={categoryMetric === item ? "active" : ""} onClick={() => setCategoryMetric(item)}>
                        {item === "tradeRows" ? t.rows : item === "totalUnits" ? t.raw : t.safe}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="horizontal-bars">
                  {categories.map((item, index) => (
                    <div className="hbar-row" key={item.id}>
                      <span>{item.id}</span>
                      <div><i style={{ width: `${(categoryValues[index] / maxCategory) * 100}%` }} /></div>
                      <strong>{format(categoryValues[index])}</strong>
                    </div>
                  ))}
                </div>
              </article>
              <article className="growth-card">
                <p className="micro">GROWTH DRIVER</p>
                <h3>{t.growthTitle}</h3>
                {categories.slice(0, 3).map((item) => (
                  <div className="growth-row" key={item.id}>
                    <span>{item.id}</span><strong>{item.growth}%</strong>
                    <div><i style={{ width: `${item.growth * 2.2}%` }} /></div>
                  </div>
                ))}
                <div className="growth-total"><strong>81.28%</strong><span>TOP 3 COMBINED</span></div>
              </article>
            </div>
            <article className="pareto-callout">
              <div><span>123</span><small>/ 662 CATEGORIES</small></div>
              <div className="pareto-track"><i /></div>
              <div><h3>{t.pareto}</h3><p>{t.paretoBody}</p></div>
            </article>
            <a className="sql-link" href={`${repo}/blob/main/sql/06_category_analysis.sql`} target="_blank" rel="noreferrer">{t.sql} · 06_category_analysis.sql ↗</a>
          </section>

          <section className="chapter" id="chapter-3">
            <div className="chapter-copy split-copy">
              <div><p className="chapter-kicker">{t.question4}</p><h2>{t.heading4}</h2></div>
              <p>{t.body4}</p>
            </div>
            <div className="people-layout">
              <article className="stage-card">
                <p className="micro">MATCHED SUBSAMPLE</p><h3>{t.stageTitle}</h3>
                <div className="stage-bars">
                  {stageData.map((item) => (
                    <div key={item[0]}><span>{lang === "zh" ? item[1] : item[0]}</span><div><i style={{ width: `${item[2] * 2.6}%` }} /></div><strong>{item[2]}%</strong></div>
                  ))}
                </div>
                <p className="footnote">902 rows within the −10 to 71 month analytical window</p>
              </article>
              <article className="gender-card">
                <p className="micro">3.18% COVERAGE</p><h3>{t.genderTitle}</h3>
                <div className="donut" aria-label="Gender distribution"><div><strong>953</strong><span>users</span></div></div>
                <div className="legend"><span><i className="boy" />Boy 51.31%</span><span><i className="girl" />Girl 45.96%</span><span><i className="unknown" />Unknown 2.73%</span></div>
              </article>
            </div>
            <a className="sql-link" href={`${repo}/blob/main/sql/07_demographic_supplement.sql`} target="_blank" rel="noreferrer">{t.sql} · 07_demographic_supplement.sql ↗</a>
          </section>

          <section className="chapter conclusion" id="chapter-4">
            <p className="chapter-kicker">{t.question5}</p>
            <h2>{t.heading5}</h2>
            <ol>
              {t.conclusion.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}
            </ol>
            <div className="method-box"><p className="micro">{t.method}</p><p>{t.methodBody}</p><a href={`${repo}/tree/main/sql`} target="_blank" rel="noreferrer">SQL REPOSITORY ↗</a></div>
          </section>
        </div>
      </div>

      <footer>
        <div><strong>ALVA DING</strong><span>DATA ANALYTICS PORTFOLIO · 2026</span></div>
        <a href={repo} target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </main>
  );
}
