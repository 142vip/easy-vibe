# An Introduction to Event Tracking

::: tip The Problem This Chapter Solves
**How do we know what users are doing inside our app?**

Imagine you run a physical bubble tea shop. You can stand behind the counter and directly observe every customer: how long did they look at the menu before ordering? Which drink did they order? Did they hesitate and leave without buying?

But if your "shop" is a mobile app or website, you can't directly see users' actions. This is where you need a technical solution — embedding recording points at key locations in your app to automatically log every step a user takes. This is **Event Tracking**.

The term "tracking" sounds technical, but the core idea is simple: **place a "recorder" wherever users might take an action, and log what they did.**

This chapter explains the process in four steps:

1. **Choose a collection method** — Decide where to place recorders and how
2. **Design the data format** — Decide what information each record should contain
3. **Transmission and caching** — Get records from the user's phone to the server safely
4. **Cleaning and storage** — Organize data, remove duplicates and errors, and store in a database
:::

---

## Choose a Collection Method — Where to Place Collectors

**Goal**: Decide how to record user actions.

For example: a product manager wants to know "how many users clicked the purchase button." To answer this, a developer needs to add logging logic to the "purchase button" code — every time a user clicks this button, a record is automatically created.

But here's a choice: should we **only place recorders at important locations** (such as only tracking "purchases" and "registrations"), or **place recorders everywhere** (tracking every click, swipe, and停留)?

Different choices correspond to different tracking approaches.

<DataTrackingDemo tab="methods" />

**Three mainstream tracking methods**

There are three commonly used tracking approaches in the industry, each with its own pros and cons:

**Method 1: Code Tracking — Manual, precise recording**

Developers manually specify in code: when a user performs a certain action, record a data entry.

An analogy: it's like assigning someone at the bubble tea shop's register to specifically record "who bought what and how much they spent." The recorded information is very detailed and accurate.

- *Advantage*: Can record very detailed business information, such as which coupon a user used and their account balance
- *Cost*: Every new tracking point requires a developer to write code, test, and release a new version — a lengthy process

**Method 2: Visual Tracking — Click-and-select recording**

No code required. The system provides a visual tool where operations staff can directly "select" buttons or areas on the app interface to monitor, and the system automatically starts recording.

An analogy: it's like using your mouse to draw a selection box around the "cash register area" on the shop's surveillance feed, and the system automatically starts counting foot traffic in that area.

- *Advantage*: No developer involvement needed; operations staff can configure it themselves, very efficient
- *Cost*: Can only record interface interactions like "what the user clicked," unable to capture deep business data like "order amount"

**Method 3: Auto Tracking — Automatically record everything**

Integrate an SDK (think of it as a "toolkit") into the app that automatically records all user actions: every click, every swipe, how long they stayed on each page.

An analogy: it's like installing cameras in every corner of the bubble tea shop, recording every move customers make.

- *Advantage*: No actions are missed, the most comprehensive coverage
- *Cost*: Data volume is very large, with much of it being useless information (like unintentional swipes); significant effort is needed afterward to filter and clean

**Step summary**: After choosing a tracking method, your app now has the ability to "record user actions."

**But there's a new problem**: While recorders can capture user actions, if each recorder logs data in a different format (e.g., some write "user ID," some write "userID," some don't record it at all), unified analysis becomes impossible. So the next step is to define a unified recording format.

---

## Design the Data Format — What Should Each Record Contain

**Prerequisite**: We've chosen a tracking method (e.g., code tracking), and the app can now capture user actions.

**Goal**: Define a unified "recording template" so that all tracking records follow a consistent format.

**Why do we need a unified format?** Imagine: if the bubble tea shop has three employees recording sales simultaneously — one writes "Xiao Ming bought pearl milk tea for 15 yuan," another writes "15, milk tea, pearl," and a third writes "one cup of pearl milk tea." At month-end, these completely different record formats would make consolidation extremely painful. That's why we need a unified "record form" that specifies which fields must be filled in for each record.

<DataTrackingDemo tab="model" />

**Core Principle: The 4W1H Recording Template**

Regardless of what action is being recorded, each data entry needs to answer five questions (abbreviated as 4W1H):

**Who — Who did it?**

We need to know which user generated this record.

- If the user is logged in, use their account ID (e.g., `user_id: "zhangsan123"`)
- If the user is not logged in, use the device's unique identifier (e.g., the phone's device number), so at least we can distinguish "this is an action from the same phone"

**When — When did they do it?**

Record the precise time the action occurred, accurate to the millisecond.

One detail here: if your app has overseas users, 3 PM Beijing time and 3 PM New York time actually differ by 13 hours. To avoid confusion, all times are uniformly converted to UTC standard time (think of it as "world unified time").

**Where & How — Under what environment?**

This part records the device and network environment when the user performed the action, called **common attributes**. They're called "common" because regardless of what action the user took, this information is automatically attached. For example:

- Device model: iPhone 15 / Xiaomi 14
- Network type: WiFi / 5G / 4G
- App version: v1.2.3
- Operating system: iOS 18 / Android 15

The value of this information: if a bug is found that only occurs on a specific device model, common attributes can help quickly pinpoint the problem.

**What — What exactly did they do?**

This part records the specific business details of the action, called **custom attributes**. Different actions require recording different information. For example:

- User clicks "Add to Cart": needs to record product name, product price, quantity
- User completes payment: needs to record order amount, payment method, coupon code

**Step summary**: Through the 4W1H template, we've transformed every user action into a uniformly formatted data record. In technical implementation, this record is typically stored in JSON format (JSON is a universal data format; the interactive component above shows what it looks like).

**But there's another problem**: The data format is now unified, but if the app has a large user base (e.g., during a promotional event, tens of thousands of records might be generated per second), the user's phone can't send a network request every time a record is generated — this would drain the battery and data, and the server couldn't handle it. So the next step is to design a smarter transmission method.

---

## Transmission and Caching — How to Safely Deliver Data to the Server

**Prerequisite**: Every user action has been recorded as a uniformly formatted JSON data entry.

**Goal**: Reliably transmit this data from the user's phone (or browser) to our server, without losing data even when the network is poor.

**Why can't we just send it directly?** If a network request is sent every time a record is generated, it's like running to the post office every time you write a letter — extremely inefficient. A more sensible approach: collect a batch of letters and send them all at once.

<DataTrackingDemo tab="pipeline" />

**Core Principle: Three Layers of Data Transmission Assurance**

Data travels from the user's phone to the server through three assurance mechanisms, ensuring both efficiency and zero data loss:

**First Layer: Batch before sending (Batch Aggregation)**

The SDK (tracking toolkit) doesn't send a request every time a record is generated. Instead, it temporarily stores records in the phone's memory. When a certain number is collected (e.g., 30 records), or after a certain time passes (e.g., 5 seconds), it packages this batch and sends it all at once.

It's like shipping packages: you don't run to the delivery station every time you buy something; you collect a few items and ship them together, saving time and effort. For the phone, this reduces network requests, saving battery and data.

**Second Layer: No data loss even when offline (Local Storage)**

In elevators or subway tunnels, phones frequently lose network signal. If data is only stored in memory, closing the app would lose the data.

So the SDK saves unsent data to the phone's local storage (similar to putting letters in a drawer first). When the network recovers, it automatically resends this data. This way, even if the user is briefly offline, no data is lost.

**Third Layer: Don't overwhelm the server (Message Queue)**

After data reaches the server, it's not written directly to the database. Why? Because during peak periods like promotional events, tens of thousands of data entries might flood in per second. If the database processes this volume directly, it could crash.

The solution is to add a "buffer" in between — technically called a **message queue** (a commonly used tool is Kafka). Its role is like a restaurant's queuing system: during peak hours, customers (data) wait in line, while the kitchen (database) processes them at its own pace, without being overwhelmed by the simultaneous influx of orders.

**Step summary**: Through "batch sending → offline local storage → message queue buffering," data has safely arrived at the server.

**But there's one more issue**: Because data is automatically resent after reconnection, the same record might be sent twice. If not handled before being stored in the database, data will be duplicated (e.g., a 100-yuan order might be recorded twice, inflating the sales figures). So the next step is to "clean" the data.

---

## Cleaning and Storage — Organize Data, Remove "Dirty Data"

**Prerequisite**: Data has safely arrived at the server through the transmission pipeline.

**Goal**: Before data is formally stored in the database, perform a "health check" — remove duplicates, fix formatting issues, and ensure the final stored data is clean and accurate.

**Why do we need cleaning?** Just like receiving a shipment of packages, you need to check: are there any duplicate shipments? Any wrong deliveries? Any damaged packaging? Data is the same — before storing it in the database, it needs to be checked and organized.

This process is technically called **ETL**, an abbreviation of three English words:
- **E**xtract: Retrieve data from the message queue
- **T**ransform: Check and fix data formats
- **L**oad: Write cleaned data into the database

<DataTrackingDemo tab="overview" />

**Core Principle: Two Key Actions in Data Cleaning**

**Action 1: Deduplication — Remove duplicate records**

As mentioned earlier, the SDK automatically resends data after reconnection, which may cause the same record to be sent multiple times. How do you identify which ones are duplicates?

The method is simple: when the client packages data, assign each record a globally unique identifier (called `dedup_id`, similar to a tracking number). Before storing data, the server checks whether this ID already exists — if it does, it's a duplicate and is discarded.

**Action 2: Validation and Format Standardization — Fix non-standard records**

Apps are continuously updated, and tracking code across different versions may have subtle differences. For example:

- An older version named the user ID field `userId`, while a newer version changed it to `user_id`
- Some records have clearly unreasonable timestamps (e.g., showing 1970)
- Some field values are unrecognizable

At this step, the system writes transformation rules to handle these issues uniformly: misaligned field names are standardized, records with abnormal timestamps are discarded, and unrecognizable values are marked as `unknown`.

**Step summary**: After deduplication and format validation, data is written in a clean, unified format to a **data warehouse** (a specialized database for storing and analyzing large volumes of data; common ones include ClickHouse, Hive, etc.). Data analysts can directly query this data using SQL statements and obtain reliable analysis results.

---

## Complete Process Review

Here's a summary of the four-step process from collection to storage:

| Step | What Was Done | What Was Gained | Remaining Issue |
|------|----------|-----------|-------------|
| **1. Choose collection method** | Decide which tracking method to use | App has recording capability | Data formats are inconsistent across recorders |
| **2. Design data format** | Standardize recording format with 4W1H template | Each record is standard JSON | Can't handle sending one-by-one at scale |
| **3. Transmission and caching** | Batch sending, offline storage, queue buffering | Data safely arrives at server | Retries may cause duplicate data |
| **4. Cleaning and storage** | Deduplication, validation, format standardization | Clean data stored in data warehouse | — |

---

## Conclusion

When a user taps a button in your app, it appears to be just a momentary action on the surface. But behind the scenes, a complete data pipeline has already begun running:

1. Tracking code captures the click and generates a standard record using the 4W1H template
2. The record is temporarily stored locally on the phone, then sent in batches to the server
3. The server receives data smoothly through a message queue, then performs deduplication and format validation
4. Finally, a clean, accurate data record is written to the data warehouse

This is the complete process of event tracking. It transforms scattered, invisible user actions into queryable, analyzable structured data. Product managers can use it to understand which features users like and where they drop off; operations teams can evaluate campaign effectiveness; developers can pinpoint which version has issues.

This "collection → modeling → transmission → cleaning" system is the foundational infrastructure for data-driven decision-making.
