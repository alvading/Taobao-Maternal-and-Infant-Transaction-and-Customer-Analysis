-- 淘宝母婴交易分析：年度与月度趋势
-- Taobao maternal and infant analysis: yearly and monthly trends
-- MySQL 9.7.1；已完成实际执行与结果验证。
-- MySQL 9.7.1; executed and validated.

USE mum_baby_analysis;

-- 1. 年度覆盖范围与核心指标。仅 2013、2014 是完整年度。
-- 1. Annual coverage and KPIs. Only 2013 and 2014 are complete years.
SELECT
    YEAR(trade_date) AS trade_year,
    COUNT(DISTINCT MONTH(trade_date)) AS covered_months,
    MIN(trade_date) AS first_trade_date,
    MAX(trade_date) AS last_trade_date,
    COUNT(*) AS trade_row_count,
    COUNT(DISTINCT user_id) AS purchasing_user_count,
    SUM(buy_amount) AS total_units,
    SUM(CASE WHEN buy_amount < 100 THEN buy_amount ELSE 0 END)
        AS units_lt_100,
    SUM(CASE WHEN buy_amount >= 100 THEN 1 ELSE 0 END)
        AS high_quantity_row_count
FROM fact_trade
GROUP BY YEAR(trade_date)
ORDER BY trade_year;

-- 2. 2014 对 2013 同比及高数量记录的增量贡献。
-- 2. 2014 versus 2013 YoY and high-quantity contribution to unit growth.
WITH yearly_summary AS (
    SELECT
        YEAR(trade_date) AS trade_year,
        COUNT(*) AS trade_row_count,
        COUNT(DISTINCT user_id) AS purchasing_user_count,
        SUM(buy_amount) AS total_units,
        SUM(CASE WHEN buy_amount < 100 THEN buy_amount ELSE 0 END)
            AS units_lt_100,
        SUM(CASE WHEN buy_amount >= 100 THEN buy_amount ELSE 0 END)
            AS units_ge_100
    FROM fact_trade
    GROUP BY YEAR(trade_date)
), yearly_with_previous AS (
    SELECT
        *,
        LAG(trade_row_count) OVER (ORDER BY trade_year)
            AS previous_trade_row_count,
        LAG(purchasing_user_count) OVER (ORDER BY trade_year)
            AS previous_user_count,
        LAG(total_units) OVER (ORDER BY trade_year)
            AS previous_total_units,
        LAG(units_lt_100) OVER (ORDER BY trade_year)
            AS previous_units_lt_100,
        LAG(units_ge_100) OVER (ORDER BY trade_year)
            AS previous_units_ge_100
    FROM yearly_summary
)
SELECT
    trade_year,
    ROUND(100.0 * (trade_row_count - previous_trade_row_count)
        / NULLIF(previous_trade_row_count, 0), 2)
        AS yoy_trade_row_growth_pct,
    ROUND(100.0 * (purchasing_user_count - previous_user_count)
        / NULLIF(previous_user_count, 0), 2)
        AS yoy_user_growth_pct,
    ROUND(100.0 * (total_units - previous_total_units)
        / NULLIF(previous_total_units, 0), 2)
        AS yoy_total_units_growth_pct,
    ROUND(100.0 * (units_lt_100 - previous_units_lt_100)
        / NULLIF(previous_units_lt_100, 0), 2)
        AS yoy_units_lt_100_growth_pct,
    ROUND(100.0 * (units_ge_100 - previous_units_ge_100)
        / NULLIF(previous_units_ge_100, 0), 2)
        AS yoy_units_ge_100_growth_pct,
    ROUND(100.0 * (units_ge_100 - previous_units_ge_100)
        / NULLIF(total_units - previous_total_units, 0), 2)
        AS high_quantity_contribution_to_unit_growth_pct
FROM yearly_with_previous
WHERE trade_year = 2014;

-- 3. 月度指标及高数量记录占比。
-- 3. Monthly KPIs and high-quantity shares.
WITH monthly_summary AS (
    SELECT
        DATE_FORMAT(trade_date, '%Y-%m') AS trade_month,
        COUNT(*) AS trade_row_count,
        COUNT(DISTINCT user_id) AS purchasing_user_count,
        SUM(buy_amount) AS total_units,
        SUM(CASE WHEN buy_amount < 100 THEN buy_amount ELSE 0 END)
            AS units_lt_100,
        SUM(CASE WHEN buy_amount >= 100 THEN buy_amount ELSE 0 END)
            AS units_ge_100,
        SUM(CASE WHEN buy_amount >= 100 THEN 1 ELSE 0 END)
            AS high_quantity_row_count
    FROM fact_trade
    GROUP BY DATE_FORMAT(trade_date, '%Y-%m')
)
SELECT
    *,
    ROUND(100.0 * units_ge_100 / NULLIF(total_units, 0), 2)
        AS high_quantity_unit_share_pct,
    ROUND(100.0 * high_quantity_row_count / NULLIF(trade_row_count, 0), 4)
        AS high_quantity_row_share_pct,
    DENSE_RANK() OVER (ORDER BY trade_row_count DESC) AS trade_row_rank,
    DENSE_RANK() OVER (ORDER BY total_units DESC) AS total_units_rank,
    DENSE_RANK() OVER (ORDER BY units_lt_100 DESC) AS units_lt_100_rank
FROM monthly_summary
ORDER BY trade_month;

-- 4. 完整年度之间的同月同比。
-- 4. Same-month YoY comparison between the two complete years.
WITH monthly_summary AS (
    SELECT
        YEAR(trade_date) AS trade_year,
        MONTH(trade_date) AS trade_month,
        COUNT(*) AS trade_row_count,
        COUNT(DISTINCT user_id) AS purchasing_user_count,
        SUM(buy_amount) AS total_units,
        SUM(CASE WHEN buy_amount < 100 THEN buy_amount ELSE 0 END)
            AS units_lt_100
    FROM fact_trade
    WHERE YEAR(trade_date) IN (2013, 2014)
    GROUP BY YEAR(trade_date), MONTH(trade_date)
), monthly_with_previous_year AS (
    SELECT
        *,
        LAG(trade_row_count, 12) OVER (ORDER BY trade_year, trade_month)
            AS previous_year_trade_rows,
        LAG(purchasing_user_count, 12) OVER (ORDER BY trade_year, trade_month)
            AS previous_year_users,
        LAG(total_units, 12) OVER (ORDER BY trade_year, trade_month)
            AS previous_year_total_units,
        LAG(units_lt_100, 12) OVER (ORDER BY trade_year, trade_month)
            AS previous_year_units_lt_100
    FROM monthly_summary
)
SELECT
    trade_year,
    trade_month,
    trade_row_count,
    purchasing_user_count,
    total_units,
    units_lt_100,
    ROUND(100.0 * (trade_row_count - previous_year_trade_rows)
        / NULLIF(previous_year_trade_rows, 0), 2)
        AS yoy_trade_row_growth_pct,
    ROUND(100.0 * (purchasing_user_count - previous_year_users)
        / NULLIF(previous_year_users, 0), 2)
        AS yoy_user_growth_pct,
    ROUND(100.0 * (total_units - previous_year_total_units)
        / NULLIF(previous_year_total_units, 0), 2)
        AS yoy_total_units_growth_pct,
    ROUND(100.0 * (units_lt_100 - previous_year_units_lt_100)
        / NULLIF(previous_year_units_lt_100, 0), 2)
        AS yoy_units_lt_100_growth_pct
FROM monthly_with_previous_year
WHERE trade_year = 2014
ORDER BY trade_month;

-- 5. 审计峰值月的大数量记录，不将其自动判定或删除为异常值。
-- 5. Audit high-quantity rows in the peak month without automatic deletion.
SELECT
    trade_row_id,
    user_id,
    auction_id,
    cat_id,
    cat1,
    buy_amount,
    trade_date
FROM fact_trade
WHERE trade_date >= '2014-11-01'
  AND trade_date < '2014-12-01'
  AND buy_amount >= 100
ORDER BY buy_amount DESC;

