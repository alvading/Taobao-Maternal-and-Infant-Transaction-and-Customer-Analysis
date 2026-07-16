-- 淘宝母婴交易分析：用户购买频次与跨日复购
-- Taobao maternal and infant analysis: purchase frequency and cross-day repeat
-- MySQL 9.7.1；已完成实际执行与结果验证。
-- MySQL 9.7.1; executed and validated.

USE mum_baby_analysis;

-- 复购定义：用户在至少两个不同日期发生购买。
-- Repeat-purchase definition: purchases on at least two distinct dates.
WITH user_summary AS (
    SELECT
        user_id,
        COUNT(*) AS trade_row_count,
        COUNT(DISTINCT trade_date) AS purchase_day_count,
        SUM(buy_amount) AS total_units,
        MIN(trade_date) AS first_trade_date,
        MAX(trade_date) AS last_trade_date
    FROM fact_trade
    GROUP BY user_id
)
SELECT
    COUNT(*) AS purchasing_user_count,
    SUM(CASE WHEN trade_row_count = 1 THEN 1 ELSE 0 END)
        AS single_row_user_count,
    SUM(CASE WHEN trade_row_count >= 2 THEN 1 ELSE 0 END)
        AS multi_row_user_count,
    SUM(CASE WHEN purchase_day_count >= 2 THEN 1 ELSE 0 END)
        AS repeat_user_count,
    ROUND(
        100.0 * SUM(CASE WHEN purchase_day_count >= 2 THEN 1 ELSE 0 END)
        / COUNT(*),
        4
    ) AS repeat_user_rate_pct,
    MAX(trade_row_count) AS max_trade_rows_per_user,
    MAX(purchase_day_count) AS max_purchase_days_per_user
FROM user_summary;

-- 验证结果 / Validated result:
-- 29,944 users; 29,919 single-row; 25 multi-row; 24 cross-day repeat;
-- repeat rate 0.0802%; maximum 4 rows and 4 purchase dates.

-- 审计“多行但单日”用户，防止把一次购物中的多个商品误判为复购。
-- Audit multi-row single-day users to avoid misclassifying multi-item baskets.
WITH user_summary AS (
    SELECT
        user_id,
        COUNT(*) AS trade_row_count,
        COUNT(DISTINCT trade_date) AS purchase_day_count
    FROM fact_trade
    GROUP BY user_id
), same_day_multi_row_users AS (
    SELECT user_id
    FROM user_summary
    WHERE trade_row_count >= 2
      AND purchase_day_count = 1
)
SELECT
    f.trade_row_id,
    f.user_id,
    f.auction_id,
    f.cat_id,
    f.cat1,
    f.buy_amount,
    f.trade_date
FROM fact_trade AS f
INNER JOIN same_day_multi_row_users AS u
    ON f.user_id = u.user_id
ORDER BY f.user_id, f.trade_date, f.trade_row_id;

-- 验证结果 / Validated result:
-- One user (1137719147) has two different auction IDs on the same date,
-- one unit each; this is treated as a multi-item same-day purchase, not repeat.

