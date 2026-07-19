---
id: swe-roles-and-specializations
title: Software Engineering Roles & Specializations Guide
sidebar_label: SWE Roles & Salaries
tags: [career, roles, salaries, reference]
---

A field guide to common software engineering job titles — what each role actually focuses on day-to-day, the tools/skills that go with it, and roughly what it pays. Useful as a map when deciding what to specialize in, when reading a job posting, or when trying to figure out "wait, what's the actual difference between an SDET and a QA Engineer?"

:::caution Salary disclaimer
All figures below are **rough national averages** at time of writing, not a guarantee. Actual compensation varies a lot based on geographic region, seniority, equity/total comp, and company size — treat these as *relative* signals (which roles trend higher/lower) rather than precise numbers to negotiate against.
:::

---

## 1. Quality & Testing

The roles most directly responsible for the testing practices covered in [Software Testing](../quality-testing-performance/software-testing.md) and [Accessibility Tools](../quality-testing-performance/accessibility-tools.md).

| Role | Focus | Key Skills/Tools | Avg. Salary |
| :--- | :--- | :--- | :--- |
| **QA Engineer** | Designs end-to-end test plans and executes a mix of manual + automated testing (unit, functional, cross-browser, UI) to catch bugs before deployment | Test case documentation, Jira, basic scripting, cross-browser debugging | $60,088 / yr |
| **Test Automation Engineer** | Writes automated scripts and builds testing frameworks to verify software reliably meets specs | Selenium, Playwright, Cypress, CI/CD integration, JUnit/TestNG/PyTest | $95,000 – $115,000 / yr |
| **SDET** (Software Development Engineer in Test) | A hybrid dev-tester: writes core application code *and* builds internal tooling, test infrastructure, and continuous-testing suites | Full-stack development, system architecture, advanced automation framework engineering, Docker | $115,000 – $135,000 / yr |

:::note How these relate
Think of this as a maturity/specialization spectrum: **QA Engineer** → broad, often manual-leaning, closest to the product. **Test Automation Engineer** → specializes in writing and maintaining the automated test suite itself. **SDET** → goes further and builds the *infrastructure* tests run on, often indistinguishable from a backend/platform engineer who happens to focus on testability.
:::

---

## 2. General Software Engineering & Web Development

The generalist and web-focused core of the industry.

| Role | Focus | Key Skills/Tools | Avg. Salary |
| :--- | :--- | :--- | :--- |
| **Software Engineer / Developer** | Versatile core engineering path: applies CS fundamentals and algorithmic thinking to design, write, and maintain code across the full application lifecycle | OOP (Java, C++, Python, Go), algorithms & data structures, SDLC best practices | $110,644 / yr |
| **Full-Stack Developer** | Owns both the front-end UI and the back-end logic/database/architecture for a product | JS/TypeScript, React/Angular/Vue, Node.js, Python/Java, SQL & NoSQL, REST/GraphQL | $115,000 – $125,000 / yr |
| **Front-End Engineer** | Specializes in UI/UX: builds responsive, performant client-side code from design specs | HTML5, CSS3, modern JS (ES6+), React/Vue/Angular, state management (Redux, Zustand), web perf | $113,185 / yr |
| **Back-End Engineer** | Designs, secures, and optimizes server-side architecture, microservices, and databases | Server languages (Java, Python, Ruby, C#, Go), SQL/NoSQL, Redis, cloud architecture, API design, security | $120,000 – $140,000 / yr |
| **UI/UX Engineer** | Sits between design and engineering — builds interactive, accessible interfaces with a strong visual/UX lens | Figma/Adobe XD, HTML/CSS, semantic layout, user research, advanced CSS animation | $95,000 – $115,000 / yr |

:::tip Front-end vs. UI/UX Engineer
The distinction is subtle: a **Front-End Engineer** is judged primarily on code quality and performance; a **UI/UX Engineer** is judged more on the *design fidelity and usability* of what they ship, often working closer to designers than to backend teams.
:::

---

## 3. Data & Analytics

Roles focused on moving, shaping, and learning from data at scale.

| Role | Focus | Key Skills/Tools | Avg. Salary |
| :--- | :--- | :--- | :--- |
| **Data Engineer** | Builds and monitors large-scale data pipelines, turning raw/unstructured data into structured, analytics-ready systems | SQL, Python/Scala, Hadoop/Spark, Airflow, Snowflake/BigQuery | $125,000 – $145,000 / yr |
| **Machine Learning / AI Engineer** | Researches, trains, and operationalizes ML/AI models for predictive analytics, vision, and other applications | Python, PyTorch, TensorFlow, statistical modeling, NLP pipelines, MLOps | $140,000 – $170,000 / yr |

---

## 4. Infrastructure, Systems & Operations

The roles that keep everything running, scaling, and talking to each other.

| Role | Focus | Key Skills/Tools | Avg. Salary |
| :--- | :--- | :--- | :--- |
| **DevOps Engineer** | Bridges engineering speed and infrastructure reliability via CI/CD, automated scaling, and environment automation | Terraform, GitHub Actions/Jenkins, Docker/Kubernetes, Linux administration | $120,000 – $145,000 / yr |
| **Cloud Architect / Engineer** | Designs and maintains cloud infrastructure and secure migration strategies | AWS, Azure, GCP, cloud security, network provisioning, virtualization | $135,000 – $160,000 / yr |
| **Site Reliability Engineer (SRE)** | Applies a software-engineering mindset to operations — uptime, system stability, automated alerting, post-mortems | Prometheus, Grafana, Python/Go/Bash automation, load balancing, disaster recovery | $130,000 – $155,000 / yr |
| **Systems / Software Integration Engineer** | Connects separate enterprise systems, legacy databases, and cloud platforms into seamless communication pipelines | Enterprise Integration Patterns, MuleSoft/Apache Camel, JSON/XML, web services, message queues | $127,327 / yr |
| **Embedded Systems Engineer** | Writes low-level, firmware-centric code for hardware — medical devices, automotive systems, robotics, IoT | C, C++, Assembly, hardware debugging, RTOS, microcontrollers, circuit analysis | $110,000 – $130,000 / yr |

:::info DevOps vs. SRE vs. Cloud Architect
These three overlap heavily in practice. Rough distinction: **DevOps Engineer** focuses on the *pipeline* (build → deploy), **SRE** focuses on *what happens after deploy* (uptime, incidents, reliability), and **Cloud Architect** focuses on the *underlying infrastructure design* all of it runs on.
:::

---

## 5. Specialized Development

Roles tied to a specific platform or domain rather than a general layer of the stack.

| Role | Focus | Key Skills/Tools | Avg. Salary |
| :--- | :--- | :--- | :--- |
| **Mobile App Developer** | Builds lightweight, interactive apps for mobile/handheld platforms | Swift/Objective-C (iOS), Kotlin/Java (Android), Flutter/React Native | $115,000 – $135,000 / yr |
| **Game Developer** | Builds game logic, virtual environments, physics, and high-performance render loops | C++, C#, Unity/Unreal Engine, 3D linear algebra, rendering | $92,891 / yr |
| **Security Engineer / WASE** | Secures infrastructure and applications via penetration testing, vulnerability scanning, and defense design | Pen testing, vulnerability scanning, network defense, cryptography, OWASP Top 10 | $82,478 / yr |

---

## 6. At a Glance: Salary Ranges by Category

A rough ordering to spot trends (using range midpoints where a range is given):

```
ML/AI Engineer            ████████████████████████████  $140k–$170k
Cloud Architect            ████████████████████████     $135k–$160k
SRE                        ███████████████████████       $130k–$155k
Data Engineer               ██████████████████████       $125k–$145k
DevOps Engineer              ████████████████████        $120k–$145k
Systems Integration Eng.      ███████████████████        $127,327
Back-End Engineer             ███████████████████        $120k–$140k
SDET                           ██████████████████        $115k–$135k
Mobile Developer                ██████████████████       $115k–$135k
Full-Stack Developer             █████████████████       $115k–$125k
Front-End Engineer                █████████████████      $113,185
Embedded Systems Engineer          ████████████████      $110k–$130k
Software Engineer (general)         ███████████████      $110,644
Test Automation / UI-UX Eng.          ██████████████     $95k–$115k
Game Developer                            █████████      $92,891
Security Engineer / WASE                    ████████     $82,478
QA Engineer                                  ██████       $60,088
```

:::tip Reading this chart
The wide gap between **QA Engineer** ($60k) and **SDET** ($115k–$135k) is really a proxy for *how much software engineering the role requires* — QA leans toward test execution and process, while SDET leans toward building the systems that make automated testing possible. If you're coming from a QA background and want to level up compensation, SDET/Test Automation Engineer is often the natural next step.
:::

---

## 7. Which Path Fits?

A few rough heuristics for narrowing down a direction:

- **Like finding bugs and thinking about edge cases, but not deep systems design?** → QA Engineer → Test Automation Engineer.
- **Like both building features *and* building the tools that test them?** → SDET.
- **Like data structures/algorithms and want the widest range of future options?** → General Software Engineer.
- **Like visual/UX detail and design collaboration?** → Front-End Engineer or UI/UX Engineer.
- **Like distributed systems, scale, and "what happens when this breaks at 3am"?** → SRE or DevOps Engineer.
- **Like security-mindset thinking — breaking things on purpose to fix them?** → Security Engineer.
- **Like math, statistics, and building things that "learn"?** → ML/AI Engineer.
- **Like hardware and the intersection of code and physical devices?** → Embedded Systems Engineer.
