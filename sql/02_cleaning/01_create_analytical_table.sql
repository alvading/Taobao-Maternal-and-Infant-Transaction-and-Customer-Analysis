-- Create the analytical table content from the staging table
USE ecommerce_analysis;

INSERT INTO user_behavior (
    userid,
    itemid,
    categoryid,
    behavior_type,
    behavior_timestamp
)
SELECT
    userid,
    itemid,
    categoryid,
    behavior_type,
    behavior_timestamp
FROM stg_user_behavior
WHERE behavior_timestamp >= UNIX_TIMESTAMP('2017-11-25 00:00:00')
  AND behavior_timestamp <  UNIX_TIMESTAMP('2017-12-04 00:00:00');

-- Validation
SELECT
    COUNT(*) AS analytical_rows,
    FROM_UNIXTIME(MIN(behavior_timestamp)) AS min_behavior_datetime,
    FROM_UNIXTIME(MAX(behavior_timestamp)) AS max_behavior_datetime
FROM user_behavior;
