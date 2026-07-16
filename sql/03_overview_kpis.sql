-- 淘宝母婴交易分析：整体规模与购买强度
-- Taobao maternal and infant analysis: overview KPIs and purchase intensity
-- MySQL 9.7.1；已完成实际执行与结果验证。
-- MySQL 9.7.1; executed and validated.

USE mum_baby_analysis;

-- 1. 整体绝对规模 | Overall absolute scale
SELECT
    COUNT(*) AS trade_row_count,
    COUNT(DISTINCT user_id) AS purchasing_user_count,
    COUNT(DISTINCT auction_id) AS distinct_auction_count,
    COUNT(DISTINCT cat1) AS top_category_count,
    COUNT(DISTINCT cat_id) AS detailed_category_count,
    SUM(buy_amount) AS total_units
FROM fact_trade;

-- 验证结果 / Validated result:
-- 29,971 trade rows; 29,944 users; 28,422 distinct auction IDs;
-- 6 top categories; 662 detailed categories; 76,250 units.

-- 2. 购买强度与高数量敏感性
-- Purchase intensity and high-quantity sensitivity
SELECT
    ROUND(COUNT(*) / COUNT(DISTINCT user_id), 4)
        AS avg_trade_rows_per_user,
    ROUND(SUM(buy_amount) / COUNT(*), 2)
        AS avg_units_per_trade_row,
    ROUND(SUM(buy_amount) / COUNT(DISTINCT user_id), 2)
        AS avg_units_per_user,
    SUM(CASE WHEN buy_amount < 100 THEN 1 ELSE 0 END)
        AS trade_rows_lt_100,
    SUM(CASE WHEN buy_amount < 100 THEN buy_amount ELSE 0 END)
        AS units_lt_100,
    ROUND(AVG(CASE WHEN buy_amount < 100 THEN buy_amount END), 2)
        AS avg_units_per_trade_row_lt_100
FROM fact_trade;

-- 验证结果 / Validated result:
-- 1.0009 rows/user; 2.54 units/row; 2.55 units/user;
-- 29,906 rows below 100 units; 45,755 units; 1.53 units/row.
-- 100 是敏感性阈值，不是删除规则。
-- 100 is a sensitivity threshold, not a deletion rule.

