# 项目背景与分析框架 | Project Background and Analysis Framework

## 1. 业务背景 | Business context

母婴商品具有明显的生命周期、品类和用户需求差异。项目目标是从历史交易数据中
描述销售现状，解释时间与品类结构，识别复购用户及高数量交易对总体指标的影响，
并形成可支持选品和用户运营的分析建议。

Maternal and infant products have distinctive lifecycle, category, and customer
demand patterns. This project describes historical sales, explains time and
category structure, identifies repeat purchasers, measures the impact of
high-quantity transactions, and develops merchandising and customer-operation
recommendations.

## 2. 数据说明 | Dataset

数据来自阿里云天池数据集 45，包含 953 条婴儿信息和 29,971 条交易记录。
交易范围为 2012-07-02 至 2015-02-05。

The source is Alibaba Tianchi Dataset 45, with 953 baby-information records and
29,971 trade records covering 2012-07-02 through 2015-02-05.

### 交易字段 | Trade fields

| 字段 Field | 含义 Meaning |
|---|---|
| `user_id` | 用户编码 / User identifier |
| `auction_id` | 源交易或商品编码；不唯一 / Source auction or item identifier; not unique |
| `cat_id` | 细分类目编码 / Detailed category code |
| `cat1` | 一级类目编码 / Top-level category code |
| `property` | 商品属性编码串 / Encoded product properties |
| `buy_mount` | 购买数量（源字段拼写）/ Purchase quantity (source spelling) |
| `day` | `YYYYMMDD` 交易日期 / Trade date in `YYYYMMDD` |

### 婴儿字段 | Baby fields

| 字段 Field | 含义 Meaning |
|---|---|
| `user_id` | 用户编码 / User identifier |
| `birthday` | `YYYYMMDD` 婴儿生日 / Baby birthday in `YYYYMMDD` |
| `gender` | 0/1/2 性别编码 / Gender code 0/1/2 |

## 3. 分析目标 | Analytical objectives

### A. 全量交易概览 | Full-trade overview

- 交易记录数、购买用户数、购买件数；
- 人均交易记录数与人均购买件数；
- 商品及类目覆盖。

### B. 时间趋势与增长拆解 | Time trends and growth decomposition

- 年、季度和月度用户数、交易记录和购买件数；
- 环比、同比及增长来源；
- 高数量记录是否集中在特定时期。

### C. 品类结构 | Category structure

- `cat1` 和 `cat_id` 的用户数、记录数、购买件数和贡献率；
- 类目集中度与高数量交易依赖；
- 复购用户的类目偏好。

### D. 用户购买与复购 | Customer purchase and repeat behavior

- 用户购买记录数、不同购买日期数和购买件数；
- 单次用户、跨日复购用户和高频用户；
- 简化 RFM，其中购买件数仅作为金额缺失时的代理指标。

### E. 补充人口属性分析 | Supplementary demographic analysis

只对 953 个匹配用户分析交易时月龄、性别和品类差异，并明确 3.18% 覆盖率与
自选择偏差，不向全体交易用户推广。

Age-at-trade, gender, and category differences are analyzed only for the 953
matched users, with explicit 3.18% coverage and selection-bias limitations.

## 4. 分析步骤 | Analytical steps

```text
源文件对账
  → 原始暂存层
  → 格式、缺失、重复、范围和关联覆盖验证
  → 强类型事实表与维度表
  → KPI 与敏感性口径
  → 时间、品类、用户和补充属性分析
  → Power BI 指标对账
  → 报告、建议与作品网站
```

## 5. 核心指标口径 | Core metric definitions

| 指标 Metric | 定义 Definition |
|---|---|
| 交易记录数 / Trade rows | 清洗后交易事实表行数；不直接称为订单数 |
| 购买用户数 / Purchasing users | 不重复 `user_id` 数量 |
| 购买件数 / Units purchased | `SUM(buy_amount)` |
| 复购用户 / Repeat purchaser | 在至少两个不同日期发生购买的用户 |
| 复购率 / Repeat rate | 复购用户 ÷ 购买用户 |
| 高数量敏感性 / High-quantity sensitivity | 对比全量与 `buy_amount < 100` 的结果；100 不是删除规则 |

## 6. 数据限制 | Limitations

- 无价格、收入和利润字段，不能计算 GMV、客单价或利润；
- 无订单号，交易记录数不能直接称为订单数；
- 无浏览、收藏和加购，不能分析完整转化漏斗；
- `property` 缺少公开编码字典；
- 婴儿信息只覆盖 3.18% 的交易用户；
- 高购买数量可能代表批量采购、数据单位差异或异常值，缺少外部字段确认。

- No price, revenue, or profit fields;
- no order ID, so trade rows are not claimed as orders;
- no browse, favorite, or cart events;
- no public property-code dictionary;
- baby information covers only 3.18% of purchasing users;
- high quantities may represent bulk purchase, unit differences, or anomalies.
