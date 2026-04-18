---
title: "ML System Design: E-Commerce Recommendations in Production"
description: How a model goes from raw data → training → deployment → live predictions → feedback loop. Concrete example — Amazon-style home page recommendations.
authors: [saurav]
tags: [machine-learning, system-design, recommendation-systems, data-pipelines, ml-in-production]
---

How a model goes from raw data → training → deployment → live predictions → feedback loop. Concrete example: Amazon-style home page recommendations.

<!-- truncate -->

## 00. The Big Picture — Two Worlds

Every ML system in production has two sides that operate independently but talk to each other. Think of them like a **kitchen (offline)** and a **restaurant floor (online)**.

| World | What Happens | Key Tools |
| :--- | :--- | :--- |
| **Offline** | Heavy thinking — crunching terabytes, training models, computing features | Spark, Python, S3, Redshift |
| **Online** | Real-time serving — must respond in under 200ms | REST APIs, Feature Store, Model Server |

The **feedback loop** (user events → data lake → retraining) is what makes the system get smarter over time.

```
[Data Lake] → [Training] → [Model Artifact]
                                  │
                               deploy
                                  ↓
[User Request] → [Rec Service] → [Model Server] → [Top-K Items → UI]
                                                          │
                          ←─── feedback loop (user events) ───┘
```

> [!NOTE]
> The offline world is where you do all the heavy thinking. The online world is real-time and must be **fast**. The feedback loop is what makes the system get smarter over time.

---

## 01. Data — Where Does It Come From?

Every ML system starts with data. On an e-commerce platform, four kinds of data are generated constantly.

#### 🟠 User Events
- Page views, searches, clicks
- Add-to-cart actions
- Purchases, ratings
- Time spent on page, scroll depth

#### 🔵 Product Catalog
- Item ID, title, description
- Category, brand, price
- Stock status, images, seller info

#### 🟢 User Profile
- User ID, location, device
- Account age, purchase history
- Loyalty tier, preferences

#### ⬜ Context
- Time of day, day of week, season/holidays
- Current session signals
- Referral source, campaign

### Data Ingestion Flow

```
[User Actions] → [Event Stream (Kafka/Kinesis)] → [Stream Consumer] → [Data Lake (S3 + Redshift)]
  clicks/buys       push                            parse + validate     write
```

---

## 02. Offline Training Pipeline

This is where the model is built. It runs as a **batch job — not in real time**. Think of it like overnight homework that prepares the system for tomorrow's customers.

### Full Training Pipeline

```
[Raw Data from Lake]
(interactions · items · users)
         ↓
[ETL + Feature Engineering]
(Spark, SQL, Python jobs)
         ↓
[Build Training Dataset]
((user, item, label) rows)
         ↓
[Time-based Split]
(train / val / test)
         ↓
[model.fit(X_train)]
(XGBoost · MF · MLP)
         ↙         ↘
[Evaluate]      [Save Artifact]
(AUC, P@K)      (.pkl / ONNX / .pt)
```

Also written to: **Feature Store** (reused in online serving) ← dashed link from dataset step.

> [!WARNING]
> **Key Concept — Time-based Splitting:** Always split data by **time**, not randomly. If you split randomly, data from the future leaks into training, and your validation AUC will look amazing but collapse in production. Use the last N days as your validation set.

### Feature Types

| Feature Type | Examples | Computed Where |
| :--- | :--- | :--- |
| **User features** | Past purchase count, avg basket size, top categories, last active time | Offline batch job → Feature Store |
| **Item features** | Category, price range, brand, popularity rank, text embeddings | Offline batch job → Feature Store |
| **Interaction features** | Time since last view, device type at click, session length | Offline batch + online session |
| **Context features** | Time of day, day of week, holiday flag, current campaign | Online (at request time) |

### Algorithm Options

| Algorithm | How It Works | When to Use |
| :--- | :--- | :--- |
| **Matrix Factorization** | Decomposes user-item matrix into user & item embeddings | Pure collaborative filtering, large user base |
| **XGBoost / LightGBM** | Gradient boosted trees on tabular features | Rich side features, interpretability needed |
| **Neural MLP** | User emb + item emb + context → dense layers → score | Complex non-linear patterns, sufficient data |
| **Two-Tower Model** | Separate encoders for user and item, dot product score | Fast candidate retrieval at scale |

---

## 03. Deployment — Putting the Model into Production

Once the model is trained, it needs to be packaged and served so it can respond to real user requests. The model doesn't know anything about serving — a **model server** wraps it with an API.

**Option A — Self-managed:** Docker container with model + preprocessing code. Deployed on Kubernetes. You control everything. Good for custom logic.

**Option B — Managed:** SageMaker Endpoint / Amazon Personalize. Less ops burden. Less control. Good for fast iteration.

### API Sequence (What Happens on Each Request)

```
① Client/App  ──── GET /recommendations?uid=123 ────────────────→ Rec. Service
② Rec. Service ─── fetch user features ─────────────────────────→ Feature Store
③ Feature Store ── {user_vec, history} ──────────────────────────→ Rec. Service
④ Rec. Service ─── POST /score {feature_batch} ─────────────────→ Model Server
⑤ Model Server ─── [score1, score2, …, scoreN] ─────────────────→ Rec. Service
⑥ Rec. Service ─── [item_id_1, …, item_id_20] ──────────────────→ Client / App
```

---

## 04. Online Inference — Real-Time Flow

When a user opens the home page, the entire recommendation pipeline runs in **milliseconds**. Here's every step, in order.

```
[User Opens Home Page]           ← HTTP request → Rec Service
         ↓
[Candidate Generation]           ← ~100–1000 items shortlisted
         ↓
[Feature Gathering]              ← user + item + context features
         ↓
[Model Scoring]                  ← score per candidate
         ↓
[Ranking + Post-process]         ← sort · diversity · business rules
         ↓
[Top-K Items → UI]               ← 20 items shown to user
```

**Total budget: ~100–200ms**

#### Candidate Generation — Sources
- Trending items
- User's past categories
- Similar-item collaborative filtering

#### Feature Gathering — Formula
`x = f(user, item, context)` where:
- `user_vec` — offline (from Feature Store)
- `session clicks` — online (from current session)
- `item static features` — from catalog

#### Ranking + Post-processing — Rules Applied
- No out-of-stock items
- Category diversity enforcement
- Sponsored ad slots

> [!IMPORTANT]
> **Latency Note:** The entire pipeline above must complete in under 200ms. This is why **user features are precomputed offline** and cached — computing them fresh on every request would be too slow.

---

## 05. Feedback Loop + Retraining

This is what separates a *static model* from a *live ML system*. Users' reactions to recommendations are logged and fed back into training.

### The Continuous Improvement Loop

```
[User sees recs]
(clicks / ignores / buys)
         ↓ user action
[Log Events]
(Kafka → Data Lake)
         ↓ append
[Fresh Training Data]
(new labels from clicks)
         ↓ train on
[Retrain Model]
(daily / weekly batch)
         ↓ eval
[Eval + A/B Test]
(shadow → canary → live)
         ↓ promote
[New Model Live]
(serves better recs)
         ↓ better recs
[User sees recs] ← loop back
```

### Retraining Triggers

| Trigger | Description | Frequency |
| :--- | :--- | :--- |
| **Scheduled** | Retrain on a fixed cadence regardless of performance | Daily / weekly |
| **Performance drift** | Monitor AUC on recent data; retrain when it drops | When threshold crossed |
| **Data drift** | Distribution of user behaviour shifts (e.g., sale season) | Continuous monitoring |
| **New product launch** | New items have no embeddings; must update model | Event-based |

> [!TIP]
> **A/B Testing before full rollout:** Never swap models cold. Standard process: **Shadow mode** (new model runs silently, no traffic) → **Canary** (5% real traffic) → **Blue/Green** (gradual shift) → **Full rollout**. If metrics drop at any stage, roll back immediately.

---

## 06. Data Leakage — The Silent Killer

Your model looks amazing offline. Then you deploy it and performance collapses. This is almost always **data leakage** — information from the future accidentally smuggled into training.

> **Definition:** Data leakage is when features used during training contain information that **would not be available at prediction time** in production.

### What Leakage Looks Like

| | Offline Training | Production |
| :--- | :--- | :--- |
| **Feature** | `user_returned_item` (post-purchase!) | `user_returned_item = NaN` (not yet!) |
| **AUC** | **0.94** — looks amazing | **0.61** — collapse |
| **Why** | Model "sees the future" during training | Model gets garbage input, outputs garbage |

### The Golden Rule for Every Feature

Before adding any feature, ask yourself:

> *"At prediction time — when a user lands on the page — would I actually have this value?"*

If **no** → drop the feature.

**Common culprits:**
- Post-event labels (returns, cancellations, reviews)
- Aggregates computed on future data
- Target-encoded statistics computed on the full dataset (not inside CV folds)

---

## 07. Quick Reference Cheatsheet

| Concept | What It Is | Key Detail to Remember |
| :--- | :--- | :--- |
| **Feature Store** | Precomputed, cached features for users and items | Written offline, read online — solves the latency problem |
| **Candidate Generation** | Shortlisting ~100–1000 items before scoring | Cannot score all millions of items in real-time |
| **Time-based split** | Train on past, validate on future slice | Random split causes leakage — always split by time |
| **Model Artifact** | Serialized trained model file | Saved with metadata: features used, training time, version |
| **Feedback Loop** | User signals reused as new training data | What makes a system improve continuously over time |
| **A/B Test** | Split traffic between old and new model | Measure real click/buy rate — not just offline AUC |
| **Data Leakage** | Future info leaking into training features | Looks great offline, collapses in production |
| **Two-stage Ranking** | Coarse retrieval → fine scoring | Speed vs accuracy trade-off — used by every big RS |
| **Post-processing** | Rules applied after model scoring | Diversity, stock filters, ad slots, compliance rules |
