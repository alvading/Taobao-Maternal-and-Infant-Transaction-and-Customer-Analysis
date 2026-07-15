# E-commerce User Behavior and Conversion Analysis

## Project Overview

This is an independent data analytics portfolio project based on the
public Alibaba Tianchi UserBehavior dataset.

The project analyzes e-commerce user behavior and conversion patterns
using SQL and BI-oriented analytical thinking. The goal is to identify
behavioral patterns, validate data quality, investigate conversion
bottlenecks, and translate analytical findings into business insights.

> **Status:** In progress  
> **Primary tools:** MySQL, SQL, Navicat  
> **Planned tools:** Python (Pandas), Power BI  
> **Dataset:** Alibaba Tianchi UserBehavior public dataset

## Business Context

An e-commerce platform generates a large volume of behavioral event
data, including page views, favorites, add-to-cart actions, and
purchases.

The analysis aims to understand how users interact with products and
move through the purchasing journey. Key business questions include:

- How active are users during the observation period?
- How are user behavior events distributed?
- Where are the major conversion bottlenecks?
- How do user activity patterns vary by time?
- What patterns can be observed in repeat purchases?
- Can users be segmented based on behavioral and purchasing
  characteristics?
- Which findings could support user operations and conversion
  improvement?

## Dataset

| Field                | Description                                       |
|----------------------|---------------------------------------------------|
| `userid`             | Unique user identifier                            |
| `itemid`             | Unique item identifier                            |
| `categoryid`         | Product category identifier                       |
| `behavior_type`      | User behavior type: `pv`, `fav`, `cart`, or `buy` |
| `behavior_timestamp` | Unix timestamp of the behavior event              |

### Data Granularity

One row represents **one user behavior event**.

### Initial Data Profile

- Total rows imported: **100,150,807**
- Observed behavior types: `pv`, `fav`, `buy`, `cart`
- Raw minimum timestamp: `-2134949234`
- Raw maximum timestamp: `2122867355`

The initial timestamp range indicates potential anomalous values. These
records are being investigated before defining analytical cleaning
rules.

## Data Architecture

``` text
Raw CSV
   |
   v
stg_user_behavior
   |
   v
Data Validation
   |
   v
Data Cleaning / User-level Sampling
   |
   v
user_behavior
   |
   v
SQL Analysis -> Python EDA -> Dashboard -> Business Insights
```

The staging table retains imported raw records. Cleaning and sampling
logic is applied downstream rather than modifying the raw staging layer.

## Analytical Workflow

1.  **Data ingestion** — Import the full public dataset and preserve raw
    records in `stg_user_behavior`.
2.  **Data validation** — Validate row count, sample records, behavior
    categories, and timestamp range.
3.  **Data cleaning** — Define the valid observation period, investigate
    outliers, check duplicates and missing values, and build a clean
    analytical table.
4.  **Development sampling** — Sample users rather than individual
    events and retain complete event histories for selected users.
5.  **SQL analysis** — Analyze activity, event distribution, conversion
    funnel, time patterns, repeat purchase, and user segments.
6.  **Python exploratory analysis** — Use Pandas for further exploration
    and visualization.
7.  **Dashboard** — Build a business-oriented Power BI dashboard and
    communicate actionable insights.

## Why User-level Sampling?

The project focuses on user behavior paths and conversion. Randomly
sampling individual event rows may remove parts of a user’s behavioral
sequence. For example, a `pv -> cart -> buy` journey could become
`pv -> cart` if the purchase event is excluded.

Therefore, the development dataset will use **user-level sampling and
retain all events for selected users**.

## Repository Structure

``` text
ecommerce-user-behavior-analysis/
├── README.md
├── .gitignore
├── data/
│   ├── raw/
│   │   └── README.md
│   └── processed/
│       └── README.md
├── sql/
│   ├── 01_validation/
│   │   └── 01_initial_data_validation.sql
│   ├── 02_cleaning/
│   │   └── README.md
│   └── 03_analysis/
│       └── README.md
├── notebooks/
│   └── README.md
├── dashboard/
│   └── README.md
└── docs/
    └── project_notes.md
```

## Current Progress

- [x] Downloaded and extracted the raw dataset
- [x] Installed and initialized local MySQL
- [x] Created the project database
- [x] Created the staging table
- [x] Imported 100,150,807 raw event records
- [x] Validated behavior categories
- [x] Identified anomalous timestamp range
- [ ] Investigate timestamp anomalies
- [ ] Define data-cleaning rules
- [ ] Create user-level development sample
- [ ] Complete SQL exploratory analysis
- [ ] Build conversion funnel analysis
- [ ] Complete repeat-purchase analysis
- [ ] Add Python EDA
- [ ] Build Power BI dashboard
- [ ] Summarize business insights and recommendations

## Portfolio Positioning

This project demonstrates a transition from BI and business systems
experience toward hands-on data analytics. It emphasizes SQL-based
exploration, data quality validation, analytical data modeling, business
metric definition, user behavior analysis, and BI-oriented
communication.

## Data Usage Notice

This project uses a public dataset for independent portfolio analysis.
The raw dataset is **not stored in this GitHub repository**. No
proprietary employer data is included.

## Author

Alva Ding

Information Systems graduate with professional experience in BI
projects, business systems, data integration, supply chain processes,
and cross-functional project delivery.


## Validation Update — Observation Window

- Raw rows: **100,150,807**
- Analytical rows retained: **100,095,231**
- Rows excluded from the analytical layer: **55,576**
- Exclusion rate: **0.0555%**
- Minimum analytical datetime: **2017-11-25 00:00:00**
- Maximum analytical datetime: **2017-12-03 23:59:59**

Daily profiling confirmed the declared observation window from **2017-11-25 through 2017-12-03**. Records outside this period remain in `stg_user_behavior` but are excluded from `user_behavior`.
