# An Introduction to Data Governance

::: tip Introduction
**Have you ever encountered this situation: the numbers on a report don't match the actual business, the same user's information is different across two systems, or analysis results are completely unreliable due to dirty data?** Data governance is the systematic approach to solving these problems. In the era of "data-driven decision-making," data quality directly determines decision quality — Garbage In, Garbage Out.
:::

**What will you learn in this article?**

After completing this chapter, you will gain:

- **Data Quality Dimensions**: Understand the six quality dimensions including completeness, accuracy, consistency, and more
- **Data Governance System**: Learn about governance frameworks spanning organization, processes, and technology
- **Data Lineage**: Master full-chain tracing from data source to consumption
- **Metadata Management**: Understand the importance of "data about data"
- **Data Layered Architecture**: Master the ODS → DWD → DWS → ADS data warehouse layering model
- **Practical Skills**: Know how to implement data governance in projects

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Data Quality Dimensions | Completeness, accuracy, consistency, timeliness |
| **Chapter 2** | Data Governance Framework | Organization, processes, technology, culture |
| **Chapter 3** | Data Lineage Tracing | Impact analysis, root cause investigation, compliance auditing |
| **Chapter 4** | Metadata Management | Technical metadata, business metadata, operational metadata |
| **Chapter 5** | Data Layered Architecture | ODS, DWD, DWS, ADS |
| **Chapter 6** | Governance Tools & Practices | Great Expectations, dbt, DataHub |

---

## 0. The Big Picture: Motivation for needing Data Governance

Data governance is not a technical problem — it's a **management problem**. It answers the core questions: **Who is responsible for the data? What are the data standards? How do we ensure data remains trustworthy?**

Imagine a company with 100 data tables, each maintained by different teams, with no unified naming conventions, no data dictionary, and no quality checks. The result: the same "monthly active users" metric yields 5 million from the marketing department and 3 million from the product department — because the definitions are different.

::: tip The Four Pillars of Data Governance
1. **Organization**: Define roles and responsibilities for data owners and data stewards
2. **Processes**: Establish standard procedures for data onboarding, changes, and decommissioning
3. **Technology**: Deploy data quality monitoring, metadata management, lineage tracing, and other tools
4. **Culture**: Make the entire company recognize that "data is an asset," not "data is a byproduct"
:::

---

## 1. The Six Dimensions of Data Quality

Data quality is not a vague concept — it can be measured across six specific dimensions. Each dimension has clear definitions and detection methods.

<DataQualityDemo />

| Dimension | Definition | Detection Method | Common Issues |
|------|------|---------|---------|
| Completeness | Whether data has missing values | Null rate check | Required fields are empty, related data missing |
| Accuracy | Whether data is correct | Rule validation, sampling verification | Negative amounts, invalid dates |
| Consistency | Whether multi-source data matches | Cross-system comparison | CRM and order system have different usernames |
| Timeliness | Whether data is updated promptly | Update time check | Inventory data lagging, prices not synced |
| Uniqueness | Whether duplicate records exist | Deduplication check | Same user registered twice |
| Validity | Whether data conforms to format rules | Regex/range validation | Invalid email format, negative age |

::: tip The 1-10-100 Rule of Data Quality
- **$1**: Validate data at the entry point to prevent dirty data from entering
- **$10**: Clean existing dirty data in the data warehouse
- **$100**: Loss from incorrect decisions caused by dirty data

The earlier you detect and fix data quality issues, the lower the cost.
:::

---

## 2. Data Governance Framework: Full Lifecycle Management

Data governance is not a one-time project but a continuous process that spans the entire data lifecycle. From data creation to destruction, each stage requires clear standards and responsible parties.

<DataGovernanceFrameworkDemo />

| Stage | Core Output | Key Roles |
|------|---------|---------|
| Define Standards | Data dictionary, naming conventions, classification and grading standards | Data Architect |
| Data Ingestion | Onboarding standards, validation rules, lineage records | Data Engineer |
| Storage Management | Layered model, permission matrix, lifecycle policies | DBA / Platform Engineer |
| Data Consumption | Data catalog, masking rules, quality reports | Data Analyst / Business Stakeholders |
| Archive & Destroy | Archival policies, deletion records, audit logs | Security & Compliance Team |

## 2. Data Governance Framework

Data governance cannot be solved by simply buying a tool — it requires a complete framework. The most commonly used reference framework in the industry is DAMA-DMBOK (Data Management Body of Knowledge).

| Governance Domain | Core Content | Key Outputs |
|---------|---------|---------|
| Data Architecture | Define data models, data flows, storage strategies | Data architecture diagrams, ER diagrams |
| Data Standards | Unified naming conventions, coding standards, metric definitions | Data dictionary, metric library |
| Data Quality | Establish quality rules, monitoring alerts, remediation processes | Quality reports, SLA dashboards |
| Data Security | Classification and grading, access control, masking and encryption | Security policies, audit logs |
| Master Data Management | Unified "golden records" for core entities like customers and products | Master data hub |
| Data Lifecycle | Manage the full process from data creation to archiving to destruction | Retention policies, archival rules |

::: tip Data Governance Maturity Model
- **Level 1 - Initial**: No unified standards, each team operates independently
- **Level 2 - Repeatable**: Basic documentation exists, but execution is inconsistent
- **Level 3 - Defined**: Unified governance processes and tools exist, most teams comply
- **Level 4 - Managed**: Quantified quality metrics and automated monitoring are in place
- **Level 5 - Optimizing**: Continuous improvement, data governance integrated into daily development workflows
:::

---

## 3. Data Lineage: Where It Comes From, Where It Goes

Data Lineage records the complete flow path of data from its source to final consumption. It's like data's "family tree," allowing you to trace the origins and destinations of any piece of data.

<DataLineageDemo />

Data lineage has three core application scenarios in practice:

| Scenario | Question | How Lineage Helps |
|------|------|------------|
| Impact Analysis | If I modify a field in the user table, which downstream reports will be affected? | Trace all dependencies downstream along the lineage |
| Root Cause Investigation | Today's GMV report data is abnormal — where did the problem occur? | Trace upstream along the lineage at each step |
| Compliance Audit | Which systems has the user's phone number passed through? Is it masked everywhere? | Track the full chain flow of sensitive fields |

::: tip Two Methods of Lineage Collection
- **Active Collection**: Parse SQL statements and ETL configurations to automatically extract table-level and field-level lineage relationships
- **Passive Collection**: Intercept execution plans of query engines (such as Hive, Spark) through hooks to record lineage in real time

Mainstream tools like Apache Atlas, DataHub, and OpenLineage all support automated lineage collection.
:::

---

## 4. Metadata Management: "Data About Data"

Metadata is data about data. If data is the content of a book, metadata is the book's table of contents, author, publication date, and ISBN number. Without metadata, data is just a pile of incomprehensible numbers and strings.

| Metadata Type | Description | Examples |
|-----------|------|------|
| Technical Metadata | Physical storage information about data | Table name, field type, partitioning method, storage location |
| Business Metadata | Business meaning of data | Field display name, business definition, calculation methodology |
| Operational Metadata | Runtime status of data | ETL execution time, data volume, update frequency |

::: tip The Importance of a Data Dictionary
A data dictionary is the most fundamental output of metadata management. A good data dictionary should include:
- **Field Name**: English name and display name
- **Data Type**: VARCHAR(50), INT, DATETIME, etc.
- **Business Definition**: What does this field represent? How is it calculated?
- **Value Range**: What are valid values? Are nulls allowed?
- **Owner**: Who maintains this field? Who to contact for issues?

Without a data dictionary, a new team member might need a week to understand a table's meaning; with one, 10 minutes is enough.
:::

---

## 5. Data Layered Architecture: ODS → DWD → DWS → ADS

A data warehouse doesn't just pile all data together — it stores data in layers based on **processing degree**. Each layer has a clear responsibility, with upper layers depending on lower layers, gradually refining raw data into business-ready data.

| Layer | Full Name | Responsibility | Data Characteristics |
|------|------|------|---------|
| ODS | Operational Data Store | Sync business database as-is | Most raw, unprocessed |
| DWD | Data Warehouse Detail | Clean, standardize, deduplicate | Clean detail records |
| DWS | Data Warehouse Summary | Aggregate by subject (day/week/month) | Pre-computed aggregate metrics |
| ADS | Application Data Store | Oriented toward specific reports/APIs | Directly usable result data |

::: tip Why Layer?
- **Reuse**: DWD layer is cleaned once and shared by all upper layers, avoiding duplicate cleaning
- **Decoupling**: Business database schema changes only affect the ODS layer, not reports
- **Performance**: DWS layer pre-aggregates; reports read directly without real-time computation
- **Traceability**: Each layer is preserved; issues can be investigated layer by layer
:::

---

## 6. Governance Tools and Practices

| Tool | Positioning | Core Capabilities | Use Cases |
|------|------|---------|---------|
| Great Expectations | Data Quality | Declarative data validation rules, auto-generated quality reports | Python data pipelines |
| dbt | Data Transformation | SQL-modeled development, built-in testing and documentation generation | Data warehouse modeling |
| DataHub | Metadata Management | Data catalog, lineage tracing, data discovery | Enterprise data governance |
| Apache Atlas | Metadata Management | Hadoop ecosystem lineage tracing | Big data platforms |
| OpenMetadata | Metadata Management | Open-source data catalog, supports multiple data sources | Small and medium teams |
| Amundsen | Data Discovery | Search-based data discovery platform | Data democratization |

::: tip A Governance Path from Scratch
If your team doesn't yet have data governance, we recommend following this sequence:
1. **Build a data dictionary first**: Document the meaning of existing tables and fields (even using Excel)
2. **Add quality checks**: Insert basic null and range validations in critical data pipelines
3. **Unify metric definitions**: Standardize the calculation methodology for core metrics like "DAU," "MAU," and "GMV"
4. **Introduce tools**: When manual management becomes too costly, adopt tools like DataHub or dbt
5. **Establish processes**: Data changes require review; quality issues have SLAs and alerts
:::

---

## Summary

Data governance is the systematic engineering that transforms data from "usable" to "easy to use, trustworthy, and traceable." It is not a one-time project but an ongoing operational process.

Key takeaways from this chapter:

1. **Six Quality Dimensions**: Completeness, accuracy, consistency, timeliness, uniqueness, validity
2. **Four Governance Pillars**: Organization, processes, technology, culture — all are essential
3. **Data Lineage**: Track data origins and destinations, supporting impact analysis and root cause investigation
4. **Metadata Management**: The data dictionary is the most fundamental and important governance output
5. **Layered Architecture**: ODS → DWD → DWS → ADS, progressively refining data value
6. **Incremental Implementation**: Start with a data dictionary and gradually introduce tools and processes

## Further Reading

- [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Data Management Body of Knowledge, the "bible" of data governance
- [DataHub](https://datahubproject.io/) - LinkedIn's open-source metadata management platform
- [Great Expectations](https://greatexpectations.io/) - Python data quality framework
- [dbt](https://www.getdbt.com/) - Data transformation tool with built-in testing and documentation
- [Apache Atlas](https://atlas.apache.org/) - Metadata governance framework for the Hadoop ecosystem
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/) - Kimball's classic on data warehouse modeling
