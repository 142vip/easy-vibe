# An Introduction to Incident Response and Troubleshooting

::: tip Foreword
**At 3 AM, your phone buzzes frantically — the entire online service is down. What do you do?** For any internet team, it's not a matter of "whether incidents will happen," but "when they will happen." Great teams aren't those that never have incidents — they're the ones that can respond quickly, recover efficiently, and learn from failures to avoid repeating them.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Severity classification awareness**: Master the P0~P4 incident severity grading standards
- **Response process**: Understand the complete incident response timeline from detection to recovery
- **Organizational collaboration**: Learn about role assignments and collaboration mechanisms in the incident command system
- **Alerting system**: Master alert escalation strategies to ensure critical issues are not missed
- **Postmortem methodology**: Learn to use the "Five Whys" to dig into root causes and write valuable postmortem reports

| Chapter | Content | Core Concepts |
|---------|---------|---------------|
| **Chapter 1** | Severity Classification | P0~P4, impact scope assessment |
| **Chapter 2** | Response Timeline | Detection → Response → Recovery → Postmortem |
| **Chapter 3** | Command System | IC, Communications Lead, Tech Lead |
| **Chapter 4** | Alert Escalation | Tiered alerts, progressive escalation |
| **Chapter 5** | Postmortem | Five Whys, blameless culture |

---

## 0. Big Picture: Failures Are the Best Teachers

Netflix has a famous tool called Chaos Monkey — it randomly kills production servers. It sounds crazy, but the logic is clear: **rather than waiting for failures to find you, proactively create failures to train your team's incident response capabilities**.

Incident response is not about improvising — it relies on a systematic approach built on **processes, roles, and tools** working together. Just like fire departments aren't formed when a fire breaks out — they train, drill, and maintain equipment on a regular basis.

::: tip Four Core Elements of Incident Response
- **Rapid Detection**: Comprehensive monitoring and alerting systems to ensure issues are detected before users notice
- **Efficient Collaboration**: Clear role assignments and communication mechanisms to avoid duplicated effort during chaos
- **Fast Recovery**: Prioritize service restoration over root cause analysis. Stop the bleeding first, then treat the disease
- **Continuous Improvement**: Every incident is a learning opportunity. Improve systems and processes through postmortems
:::

---

## 1. Severity Classification: Not Every Incident Requires "All Hands on Deck"

A button displaying the wrong color and the entire payment system being down are clearly not at the same level of severity. **Incident classification** exists so that teams can respond to issues at the appropriate level — neither overreacting and wasting resources, nor underestimating problems and allowing damage to escalate.

<SeverityLevelDemo />

| Level | Name | Impact Scope | Response Requirement | Example |
|-------|------|-------------|---------------------|---------|
| P0 | Critical | Core business completely unavailable | Immediate response, all hands on deck | Payment system down, data breach |
| P1 | Severe | Core functionality severely impaired | Respond within 15 minutes | Login failure rate > 50%, widespread API timeouts |
| P2 | Major | Some features malfunctioning | Respond within 1 hour | Inaccurate search results, some pages returning 500 |
| P3 | Minor | Non-core features malfunctioning | Handle during business hours | Avatar loading failures, non-critical notification delays |
| P4 | Low | UX issues | Schedule for next iteration | UI misalignment, copy errors |

::: tip Key Principles of Classification
- **Number of affected users**: A P2 affecting 100% of users may be more urgent than a P1 affecting 1% of users
- **Business impact**: Issues directly affecting revenue (payments, orders) have higher priority
- **Degradable**: If there's a temporary workaround that mitigates the impact, the severity can be appropriately downgraded
- **Dynamic adjustment**: As investigation progresses, the level may be upgraded or downgraded
:::

---

## 2. Response Timeline: The Complete Process from Detection to Postmortem

An incident response is like a relay race — each stage has clear objectives and handoff points. A clear timeline keeps the team organized even in chaos.

<IncidentTimelineDemo />

::: tip Five Stages of Incident Response
1. **Detection**: Discover anomalies through monitoring alerts, user reports, or internal inspections. Goal: Detect as early as possible, minimize MTTD (Mean Time to Detect).
2. **Response**: Confirm the incident, assess severity, assemble the response team, and establish communication channels. Goal: Quickly organize an effective response force.
3. **Mitigation**: Take temporary measures to restore service, such as rolling back deployments, switching to backup nodes, or rate limiting/degrading. Goal: Stop the bleeding first, restore user experience.
4. **Resolution**: Find the root cause and fix it permanently. Goal: Eliminate the underlying issue, prevent recurrence.
5. **Postmortem**: Review the entire process, analyze root causes, and develop improvement measures. Goal: Learn from failures, make the system more resilient.
:::

| Metric | Meaning | Optimization Direction |
|--------|---------|----------------------|
| MTTD | Mean Time to Detect | Improve monitoring coverage, lower alert thresholds |
| MTTR | Mean Time to Recover | Automate recovery, rehearse response plans |
| MTBF | Mean Time Between Failures | Improve system reliability, eliminate single points of failure |

---

## 3. Command System: Who Commands ThOverview of "Incident"

In a major incident, the biggest fear isn't technical challenges but **chaos** — a dozen people investigating simultaneously, nobody knowing what others are doing, critical information fragmented across various chat groups. The Incident Command System exists to solve this problem.

<IncidentCommandDemo />

::: tip Three Core Roles
1. **Incident Commander (IC)**: The overall person in charge of the incident response. Responsible for decision-making, coordinating resources, and setting the pace. The IC doesn't need to be the most technically skilled person, but must be the calmest and have the best big-picture view.
2. **Communications Lead**: Responsible for external communication — updating status pages, notifying customers, briefing management. This allows the IC and technical staff to focus on solving the problem without being interrupted by communication tasks.
3. **Tech Lead**: Responsible for technical investigation and remediation. Organizes technical staff in division of labor and reports progress and solutions to the IC.
:::

---

## 4. Alert Escalation: Ensuring Critical Issues Are Not Missed

The alert system is the "eyes" of incident response. But too few alerts lead to missed issues, while too many cause "alert fatigue" — when you receive hundreds of alerts daily, the truly important one can easily get buried. **Alert escalation strategies** are the key to solving this problem.

<AlertEscalationDemo />

::: tip Three Tiers of Alert Escalation
1. **Tier 1 Response (L1)**: When an alert triggers, first notify the on-duty engineer. If not acknowledged within 15 minutes, automatically escalate.
2. **Tier 2 Escalation (L2)**: Notify team leads and relevant domain experts. If not mitigated within 30 minutes, continue escalating.
3. **Tier 3 Escalation (L3)**: Notify technical directors and management, activate full emergency response.
:::

| Alert Level | Notification Method | Response Deadline | Escalation Condition |
|------------|-------------------|------------------|---------------------|
| Warning | IM message | Handle during business hours | Unresolved for 30 minutes |
| Critical | Phone + IM | Acknowledge within 15 minutes | Unacknowledged or unmitigated |
| Fatal | Phone barrage + SMS | Respond within 5 minutes | Auto-escalate to management |

---

## 5. Postmortem: Learning from Failures

After an incident is resolved, the most important step is the **postmortem**. A postmortem is not about assigning blame — it's about finding systemic improvement opportunities. Companies like Google and Meta practice a "blameless postmortem" culture — focusing on "why the system allowed this error to happen," not "who made this error."

<PostmortemDemo />

::: tip "Five Whys" Analysis Method
Starting from the surface symptom, repeatedly ask "why" until you find the root cause:
1. **Why did the service go down?** → Database connection pool exhausted
2. **Why was the connection pool exhausted?** → Slow queries holding connections without releasing them
3. **Why were there slow queries?** → Missing indexes, causing full table scans
4. **Why were indexes missing?** → No DBA review when new tables went live
5. **Why was there no review?** → No mandatory SQL review process

The root cause is not "someone forgot to add an index" but "there's no SQL review process." Fixing the root cause prevents recurrence.
:::

---

## Summary

Incident response and troubleshooting is an essential capability for every technical team. It doesn't rely on heroic individual efforts, but on systematic processes, clear role assignments, and continuous postmortem-driven improvement.

Key takeaways from this chapter:

1. **Tiered response**: P0~P4 classification ensures the appropriate level of effort for each level of issue
2. **Clear timeline**: Detection → Response → Mitigation → Resolution → Postmortem, with clear objectives at each stage
3. **Command system**: IC + Communications Lead + Tech Lead, with divided responsibilities to avoid chaos
4. **Alert escalation**: Tiered alerts + automatic escalation to ensure critical issues are not missed
5. **Blameless postmortem**: Use the "Five Whys" to dig into root causes, focus on system improvement rather than individual blame

## Further Reading

- [Google SRE Book - Incident Response](https://sre.google/sre-book/managing-incidents/) - Google's incident management practices
- [PagerDuty Incident Response Guide](https://response.pagerduty.com/) - PagerDuty's open-source incident response guide
- [Atlassian Incident Management](https://www.atlassian.com/incident-management) - Atlassian's incident management best practices
- [Learning from Incidents](https://www.learningfromincidents.io/) - Community resources for learning from incidents
- [Chaos Engineering (O'Reilly)](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/) - Chaos engineering principles and practices
