-- 淘宝母婴交易分析：数据库与原始暂存表
-- Taobao maternal and infant analysis: database and raw staging tables
-- MySQL 9.7.1；已完成实际建表和导入行数验证。
-- MySQL 9.7.1; table creation and import row counts were validated.

CREATE DATABASE IF NOT EXISTS mum_baby_analysis
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mum_baby_analysis;

CREATE TABLE IF NOT EXISTS stg_baby_raw (
    user_id  VARCHAR(20),
    birthday VARCHAR(20),
    gender   VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS stg_trade_raw (
    user_id     VARCHAR(20),
    auction_id  VARCHAR(30),
    cat_id      VARCHAR(20),
    cat1        VARCHAR(20),
    property    TEXT,
    buy_mount   VARCHAR(20),
    day         VARCHAR(20)
);

-- CSV 通过 Navicat 导入后应与源数据行数对账。
-- Reconcile Navicat CSV imports to source data-row counts.
SELECT 'stg_baby_raw' AS table_name, COUNT(*) AS row_count
FROM stg_baby_raw
UNION ALL
SELECT 'stg_trade_raw', COUNT(*)
FROM stg_trade_raw;

-- 已验证结果 / Validated result:
-- stg_baby_raw = 953
-- stg_trade_raw = 29,971
