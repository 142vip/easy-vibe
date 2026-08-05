# Principles of Data Visualization

::: tip Preface
**A good chart is worth a thousand rows of data.** Data visualization transforms abstract numbers into intuitive visual representations, allowing people to understand the story behind the data in seconds. From Excel charts to Grafana monitoring dashboards, visualization is everywhere.
:::

**What will you learn in this article?**

After completing this chapter, you will gain:

- **Chart Selection**: Choose the most appropriate chart type based on your data purpose
- **Visualization Principles**: Master the core design principles of data visualization
- **Dashboard Design**: Understand layout patterns for different types of dashboards
- **Tool Ecosystem**: Familiarize yourself with the positioning and selection of mainstream visualization tools
- **Common Pitfalls**: Avoid misleading charts and common visualization mistakes

| Chapter | Content | Key Concepts |
|-----|------|---------|
| **Chapter 1** | Chart Type Selection | Comparison, trends, proportions, distributions, relationships |
| **Chapter 2** | Visualization Design Principles | Data-ink ratio, consistency, readability |
| **Chapter 3** | Dashboard Layout | Overview, comparison, drill-down, real-time |
| **Chapter 4** | Tool Selection | ECharts, D3, Grafana, Metabase |
| **Chapter 5** | Common Pitfalls | Truncated axes, 3D pie charts, color misuse |

---

## 0. The Big Picture: Why Visualization Matters

The human brain processes visual information much faster than text. A line chart lets you quickly see that "sales dropped last month," while the same information presented in a table might require row-by-row comparison to reach the same conclusion.

The core value of visualization:

- **Discover patterns**: Trends, cycles, and outliers are immediately apparent in charts
- **Support decision-making**: Enable non-technical people to understand data and participate in decisions
- **Communication efficiency**: A picture is worth a thousand words, reducing ambiguity in data interpretation

::: tip Visualization ≠ Pretty
The goal of visualization is to **convey information**, not to show off. A plain but accurate bar chart is far more valuable than a flashy but hard-to-understand 3D chart.
:::

---

## 1. Chart Type Selection: Tell the Right Story with the Right Chart

The first step in choosing a chart is not "what chart do I like," but "what information do I want to convey." Different data purposes correspond to different optimal chart types.

<ChartTypeSelectorDemo />

### Chart Selection Quick Reference

| Data Purpose | Recommended Chart | Not Recommended | Reason |
|---------|---------|--------|------|
| Compare magnitudes | Bar chart, Column chart | Pie chart | The human eye is more sensitive to length differences than angle differences |
| Show trends | Line chart, Area chart | Bar chart | The continuity of a line implies temporal continuity |
| Show proportions | Pie chart (≤5 categories), Stacked bar chart | 3D pie chart | 3D perspective distorts area proportions |
| Show distributions | Histogram, Box plot | Line chart | Distributions require viewing frequency, not trends |
| Show relationships | Scatter plot, Bubble chart | Bar chart | The relationship between two continuous variables requires two-dimensional space |

::: tip A Simple Decision Rule
- **One variable** → Histogram (distribution) or number card (KPI)
- **Two variables** → Line chart (time vs. value) or scatter plot (value vs. value)
- **Multiple categories** → Bar chart (comparison) or pie chart (proportion, ≤5 categories)
- **Multiple dimensions** → Radar chart or parallel coordinates plot
:::

---

## 2. Visualization Design Principles: Visual Encoding Principles

Good visualization is not about being "pretty" but about being "understandable." Several classic principles proposed by Edward Tufte in *The Visual Display of Quantitative Information* remain important references for visualization design today.

| Principle | Description | Anti-pattern |
|------|------|---------|
| Data-ink ratio | The proportion of "ink" used to display data in a chart should be as high as possible | Excessive gridlines, decorative elements |
| Minimize non-data elements | Remove visual elements that convey no information | 3D effects, shadows, gradient backgrounds |
| Consistent scale | Start axes from zero with uniform tick marks; if truncating an axis, clearly indicate it | Y-axis starting at 95 without explanation |
| Sensible color use | Use color to encode information, not for decoration | Rainbow colors for ordinal data |
| Clear labeling | Title, axis labels, legend, and units are all indispensable | No units, no time range |

### 2.1 Data-Ink Ratio

> The proportion of "ink" used to express data in a chart relative to the total "ink" should be as high as possible.

Simply put: **remove everything that doesn't convey information**.

| Should Remove | Should Keep |
|-----------|-----------|
| 3D effects, shadows, gradients | Data points, axis labels |
| Excessive gridlines | Key reference lines (e.g., target values) |
| Decorative icons | Legends (when there are multiple series) |
| Flashy background colors | Clear titles and units |

### 2.2 Consistency Principle

- **Color consistency**: Use the same color for the same dimension across different charts, e.g., "revenue" is always blue
- **Scale consistency**: Axes should start from 0 whenever possible, unless there's a good reason and clear annotation
- **Time consistency**: Intervals on the time axis should be uniform; don't plot unevenly spaced time points as if they were evenly spaced

### 2.3 Readability Principle

- **Titles should state conclusions**: Not "Monthly Sales" but "Sales Have Declined for 3 Consecutive Months"
- **Annotate key points**: Add annotations at outliers and inflection points to guide the reader's attention
- **Control information density**: Each chart should convey 1-2 core messages; don't cram too much in

::: tip Three Rules for Color Use
1. **Same metric, same color**: Revenue should always be blue across all charts, not sometimes blue and sometimes green
2. **Sequential data uses gradients**: Temperature from low to high uses a blue→red gradient, not discrete colors
3. **Consider colorblind-friendliness**: Approximately 8% of males have red-green color blindness; avoid relying solely on red and green to distinguish critical information
:::

---

## 3. Dashboard Layout: Different Scenarios, Different Patterns

A dashboard is an organic combination of multiple charts. A good dashboard doesn't just pile charts together—it selects an appropriate layout pattern based on the use case.

<DashboardLayoutDemo />

### Four Common Layout Patterns

| Layout Pattern | Core Structure | Use Case | Design Points |
|---------|---------|---------|---------|
| Overview | KPI cards + trend charts + detail tables | Executive daily reports, operations dashboards | Place core metrics at the top; key numbers visible at a glance |
| Comparison analysis | Symmetric left-right layout | A/B testing, year-over-year analysis | Keep comparison dimensions consistent, highlight differences |
| Drill-down analysis | Progressive expansion from summary to detail | Sales analysis, user behavior analysis | Support click interactions, layer-by-layer exploration |
| Real-time monitoring | Large numbers + real-time curves + alert status | Double Eleven big screens, server monitoring | Auto-refresh, dark background, suitable for projection |

### 5 Principles of Dashboard Design

1. **First ask "who is looking"**: The CEO views strategic metrics, operations views process metrics, engineers view technical metrics
2. **5-second rule**: Users should understand the dashboard's core information within 5 seconds
3. **Information hierarchy**: Place the most important content in the upper-left, secondary content below
4. **Minimize scrolling**: Display core content on one screen; avoid making users scroll to see critical data
5. **Whitespace**: Don't fill every inch of space; appropriate whitespace makes the visual experience more comfortable

::: tip Dashboard vs. Report
- **Dashboard**: Real-time/near-real-time, interactive, oriented toward monitoring and quick decision-making
- **Report**: Generated periodically (daily/weekly/monthly), static, oriented toward detailed analysis and archival

These two are not replacements for each other but complements. Dashboards identify problems; reports analyze them in depth.
:::

---

## 4. Tool Selection: From Code Libraries to BI Platforms

Visualization tools can be divided into three tiers: code-level chart libraries, data analysis chart libraries, and BI platforms. Which one to choose depends on requirements complexity, interaction needs, and team technical capabilities.

### 4.1 Code-Level Chart Libraries

| Tool | Language/Platform | Features | Use Case |
|------|----------|------|---------|
| ECharts | JavaScript | Ready to use, rich chart types, excellent documentation | Embedded charts in business systems |
| D3.js | JavaScript | Low-level flexibility, can customize any visualization | Highly customized data visualization |
| Chart.js | JavaScript | Lightweight and simple, quick to get started | Simple chart requirements |
| Matplotlib | Python | Standard scientific computing library, static charts | Data analysis, paper figures |
| Plotly | Python/JS | Interactive charts, 3D support | Data exploration, Jupyter Notebook |

### 4.2 BI Platforms (No-Code / Low-Code)

| Tool | Positioning | Core Strength | Suitable Team |
|------|------|---------|---------|
| Grafana | Monitoring visualization | Strong time-series support, alerting integration | Ops/SRE teams |
| Metabase | Lightweight BI | Open source and free, create charts from SQL | Small to mid teams building quickly |
| Apache Superset | Enterprise BI | Open source, supports big data sources | Companies with data teams |
| Tableau | Commercial BI | Drag-and-drop, excellent visualization | Business analysts |
| Power BI | Commercial BI | Strong integration with Microsoft ecosystem | Enterprises using the Microsoft stack |

::: tip Selection Advice
- **Developers embedding charts in products** → ECharts or Chart.js (for simple scenarios)
- **Data analysts doing exploratory analysis** → Plotly + Jupyter or Metabase
- **Ops monitoring dashboards** → Grafana (the de facto standard)
- **Business teams doing self-service analytics** → Metabase (open source) or Tableau (commercial)
- **Need high customization** → D3.js (steep learning curve, but most flexible)
:::

---

## 5. Common Pitfalls: These Charts Are Lying to You

Data visualization is a double-edged sword: used well, it reveals truth; used poorly, it creates illusions. Below are the most common visualization pitfalls that every data practitioner should be able to recognize.

### 5.1 Truncated Axes

Changing the Y-axis starting point from 0 to a large number makes tiny differences look like massive changes.

| Scenario | Actual Difference | Visual Perception |
|------|---------|---------|
| Y-axis starts at 0 | Product A: 98 points, Product B: 95 points | Small gap |
| Y-axis starts at 90 | Same data | A appears to be several times larger than B |

**When is truncation acceptable?** When absolute values are large but changes are small (e.g., stock price from 100 to 105), truncation is reasonable, but it must be clearly labeled.

### 5.2 The 3D Pie Chart Perspective Trap

3D perspective makes sectors closer to the viewer appear larger. A 25% sector can look like 35% under a 3D viewing angle.

**Solution**: Never use 3D pie charts. Use regular pie charts or donut charts, or simply use bar charts.

### 5.3 Color Misuse

| Wrong Practice | Correct Practice |
|---------|---------|
| Using red-green to represent data | Using blue-orange and other colorblind-safe palettes |
| Different colors for each category | Using shades of the same color family for the same series |
| Encoding continuous data with color but no legend | Always provide a color legend and value labels |
| Insufficient contrast between background and data colors | Ensure WCAG AA level contrast |

### 5.4 Other Common Mistakes

| Pitfall | Problem | Fix |
|------|------|------|
| Dual Y-axes | Two unrelated metrics sharing the X-axis implies causation | Split into two charts, or explicitly state no causal relationship |
| Area misrepresentation | Using a circle's radius instead of area to represent values | When values double, area should double, not radius |
| Uneven time axis | January, March, and December spaced equally | Arrange by actual time proportions |
| Too many categories | Pie chart with 15 sectors | Use bar charts for more than 5 categories, or group into "Other" |

::: tip Ethical Guidelines for Visualization
The purpose of visualization is to **aid understanding**, not to **manipulate perception**. Ask yourself every time you create a chart:

- If I were the reader, would this chart lead me to a wrong conclusion?
- Am I hiding unfavorable data?
- Are the axes, scales, and colors presenting the data fairly?
:::

---

## Summary

Data visualization is the "last mile" of delivering data value. No matter how good the analysis is, if it cannot be correctly understood, it's as if the analysis never happened.

Let's review the key takeaways from this chapter:

1. **Choose the right chart**: Select chart types based on data purpose (comparison, trends, proportions, distributions, relationships)
2. **Design principles**: High data-ink ratio, consistency, and readability are the three core principles
3. **Dashboard layout**: Overview, comparison, drill-down, and real-time patterns cover most scenarios
4. **Tool selection**: From ECharts to Grafana, choose based on team capability and requirements complexity
5. **Avoid pitfalls**: Truncated axes, 3D pie charts, and color misuse are the most common misleading techniques

## Further Reading

- [The Visual Display of Quantitative Information](https://www.edwardtufte.com/tufte/books_vdqi) - Edward Tufte's visualization classic
- [ECharts Official Documentation](https://echarts.apache.org/zh/index.html) - The most popular charting library
- [D3.js](https://d3js.org/) - Powerful low-level visualization library
- [Grafana](https://grafana.com/) - The de facto standard for monitoring visualization
- [From Data to Viz](https://www.data-to-viz.com/) - Chart type selection decision tree
- [ColorBrewer](https://colorbrewer2.org/) - Colorblind-safe color scheme tool
