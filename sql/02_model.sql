-- 淘宝母婴交易分析：清洗与分析模型
-- Taobao maternal and infant analysis: cleaning and analytical model
--
-- 输入 / Input: stg_baby_raw, stg_trade_raw
-- 输出 / Output: dim_baby, fact_trade
-- MySQL 9.7.1；已完成实际执行与结果对账。
-- MySQL 9.7.1; execution and reconciliation were validated.

USE mum_baby_analysis;

-- 重建分析层；原始暂存表不受影响。
-- Rebuild the analytical layer without modifying raw staging tables.
DROP TABLE IF EXISTS fact_trade;
DROP TABLE IF EXISTS dim_baby;

CREATE TABLE dim_baby (
    user_id   INT UNSIGNED PRIMARY KEY,
    birthday  DATE NOT NULL,
    gender    TINYINT UNSIGNED NOT NULL,
    CONSTRAINT chk_dim_baby_gender
        CHECK (gender IN (0, 1, 2))
);

CREATE TABLE fact_trade (
    trade_row_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id        INT UNSIGNED NOT NULL,
    auction_id     BIGINT UNSIGNED NOT NULL,
    cat_id         INT UNSIGNED NOT NULL,
    cat1           INT UNSIGNED NOT NULL,
    item_property  TEXT,
    buy_amount     SMALLINT UNSIGNED NOT NULL,
    trade_date     DATE NOT NULL,
    CONSTRAINT chk_fact_trade_buy_amount
        CHECK (buy_amount > 0)
);

INSERT INTO dim_baby (
    user_id,
    birthday,
    gender
)
SELECT
    CAST(user_id AS UNSIGNED),
    STR_TO_DATE(birthday, '%Y%m%d'),
    CAST(gender AS UNSIGNED)
FROM stg_baby_raw;

INSERT INTO fact_trade (
    user_id,
    auction_id,
    cat_id,
    cat1,
    item_property,
    buy_amount,
    trade_date
)
SELECT
    CAST(user_id AS UNSIGNED),
    CAST(auction_id AS UNSIGNED),
    CAST(cat_id AS UNSIGNED),
    CAST(cat1 AS UNSIGNED),
    NULLIF(TRIM(property), ''),
    CAST(buy_mount AS UNSIGNED),
    STR_TO_DATE(`day`, '%Y%m%d')
FROM stg_trade_raw;

-- 分析层对账 | Analytical-layer reconciliation
SELECT
    (SELECT COUNT(*) FROM dim_baby) AS baby_rows,
    COUNT(*) AS fact_rows,
    COUNT(DISTINCT trade_row_id) AS distinct_trade_row_ids,
    SUM(item_property IS NULL) AS null_property_rows,
    SUM(buy_amount) AS total_units,
    MIN(trade_date) AS min_trade_date,
    MAX(trade_date) AS max_trade_date,
    CASE
        WHEN (SELECT COUNT(*) FROM dim_baby) = 953
         AND COUNT(*) = 29971
         AND COUNT(DISTINCT trade_row_id) = 29971
         AND SUM(item_property IS NULL) = 144
         AND SUM(buy_amount) = 76250
         AND MIN(trade_date) = '2012-07-02'
         AND MAX(trade_date) = '2015-02-05'
        THEN 'PASS'
        ELSE 'FAIL'
    END AS reconciliation_status
FROM fact_trade;

