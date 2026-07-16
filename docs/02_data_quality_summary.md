# 数据质量与建模摘要 | Data Quality and Modeling Summary

## 数据对账 | Reconciliation

| 检查 Check | 结果 Result | 状态 Status |
|---|---:|---|
| 婴儿源数据与导入 / Baby source vs import | 953 = 953 | PASS |
| 交易源数据与导入 / Trade source vs import | 29,971 = 29,971 | PASS |
| 误导入表头 / Accidental header rows | 0 | PASS |

## 婴儿信息 | Baby information

| 检查 Check | 结果 Result | 决策 Decision |
|---|---:|---|
| `user_id` 缺失 / Missing | 0 | 可作为维度键候选 |
| `user_id` 重复 / Duplicates | 0 | 清洗后设为主键 |
| 生日格式或转换失败 / Birthday failures | 0 | 转为 `DATE` |
| 生日范围 / Range | 1984-06-16–2015-08-15 | 结合交易时年龄审查 |
| `gender` 分布 | 0=489, 1=438, 2=26 | 转为 `TINYINT UNSIGNED` |

## 交易信息 | Trade history

| 检查 Check | 结果 Result | 决策 Decision |
|---|---:|---|
| 核心字段缺失 / Core-field missing | 0 | 保留 |
| `property` 缺失 | 144（约 0.48%） | 保留；属性分析标记缺失 |
| `auction_id` 重复编号组 | 1,122 | 不作为主键、不据此去重 |
| 七字段完全重复 / Exact duplicate rows | 0 | 不去重 |
| 数字格式异常 / Numeric format failures | 0 | 可进行强类型转换 |
| 日期转换失败 / Date failures | 0 | 转为 `DATE` |
| 交易日期范围 / Trade range | 2012-07-02–2015-02-05 | 用于趋势分析 |

## 分析层字段类型 | Analytical data types

| 字段 Field | 类型 Type | 依据 Rationale |
|---|---|---|
| `trade_row_id` | `BIGINT UNSIGNED AUTO_INCREMENT` | `auction_id` 不唯一的代理主键 |
| `user_id` | `INT UNSIGNED` | 最大值 2,431,252,842 |
| `auction_id` | `BIGINT UNSIGNED` | 最大值 43,686,928,018 |
| `cat_id` | `INT UNSIGNED` | 最大值 122,696,024 |
| `cat1` | `INT UNSIGNED` | 最大值 122,650,008 |
| `item_property` | `TEXT` | 长编码字符串，可缺失 |
| `buy_amount` | `SMALLINT UNSIGNED` | 范围 1–10,000 |
| `trade_date` | `DATE` | 全部成功转换 |

## 高购买数量敏感性 | High-quantity sensitivity

| 指标 Metric | 结果 Result |
|---|---:|
| 总交易记录 / Total rows | 29,971 |
| 总购买件数 / Total units | 76,250 |
| `buy_amount >= 100` 记录 | 65（0.2169%） |
| 上述记录贡献件数 / Contributed units | 30,495（39.99%） |
| `buy_amount >= 500` | 9 |
| `buy_amount >= 1000` | 5 |

高数量记录来自不同用户和日期，未发现重复导入证据。项目保留原始数值，同时在
KPI、趋势和品类排名中提供 `<100` 件敏感性对照。

High-quantity rows span different users and dates with no duplicate-import
pattern. Raw values are retained, while KPIs, trends, and category rankings
include a `<100` sensitivity comparison.

## 两表覆盖 | Join coverage

| 指标 Metric | 结果 Result |
|---|---:|
| 全部交易用户 / All trade users | 29,944 |
| 匹配婴儿用户 / Matched baby users | 953（3.18%） |
| 全部交易行 / All trade rows | 29,971 |
| 匹配交易行 / Matched trade rows | 956（3.19%） |

年龄与性别分析仅作为匹配子样本描述，不构成全体用户结论。

Age and gender analysis is descriptive of the matched subset only and does not
support conclusions about all purchasing users.
