Ek concrete scenario lete hain: **“Amazon home page pe personalized product recommendations dikhani hain”**. Iske through end‑to‑end ML system ka flow samjhte hain – data kahaan se aata hai, training kahaan hoti hai, production me kya chalta hai. [aws.amazon](https://aws.amazon.com/blogs/architecture/architecting-near-real-time-personalized-recommendations-with-amazon-personalize/)

High level:  
- Offline side: data collection → feature store / warehouse → training pipeline → model artifact.  
- Online side: user aata hai → features nikle → model se prediction → UI me recommendations show.  

***
## 1. Data kahan se aata hai? (Raw → Storage)
Har user action Amazon pe log hota hai:  

- **User events**: page views, searches, clicks, add-to-cart, purchases, ratings, time spent, etc. [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)
- **Product catalog**: item id, title, description, category, price, brand, stock, etc. [argoid.findableis](https://argoid.findableis.com/blog/decoding-amazons-recommendation-system.html)
- **User profile**: user id, location, device, maybe demographics (agar available).  

Flow (simplified):

1. **Front-end / apps** events →  
2. **Event stream** (e.g. Kafka/Kinesis) me push →  
3. **Streaming consumers** in events ko **data lake / warehouse** (S3 + Redshift / Snowflake type) me store karte hain. [aws.amazon](https://aws.amazon.com/blogs/architecture/architecting-near-real-time-personalized-recommendations-with-amazon-personalize/)

Yahi tumhara **historical dataset** banta hai jisse ML training hogi.  

***
## 2. Offline training pipeline (Dev / training world)
Yahan tum notebook / batch job style kaam socho. Rough stages:
### 2.1 Data preparation
- Warehouse se past N months ka data fetch:  
  - `user_item_interactions` (user, item, event_type, timestamp).  
  - `items` table (product features).  
  - `users` table (user features). [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)

- ETL / feature engineering:  
  - User side features (per user):  
    - past purchase count, categories distribution, last active time, avg basket size.  
  - Item side features (per item):  
    - category, price range, popularity, textual embeddings from title/description (optional).  
  - Interaction features:  
    - time since last interaction, device type, referrer, etc. [library.ucsd](https://library.ucsd.edu/dc/object/bb8503744c/_2_1.pdf)

Ye sab offline batch jobs (Spark, SQL, Python) se banta hai, phir **feature tables** / feature store me likha jata hai. [linkedin](https://www.linkedin.com/pulse/designing-scalable-recommendation-system-ml-pipelines-sanobar-k-khan-cqlkc)
### 2.2 Training dataset banana
Ab tum ek specific ML task pick karte ho, jaise:

- Task: “Given (user, item, context), probability that user will click / add to cart / buy this item.”  

Training data shape:

- Rows: (user_id, item_id, features..., label).  
- Label:  
  - 1 = user ne interact kiya (click/ buy),  
  - 0 = negative sample (item show hua ya candidate set se liya, but user ne kuch nahi kiya). [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)
### 2.3 Model training
Algorithms options (Amazon style):

- **Collaborative filtering / matrix factorization**: user–item interaction matrix → user embedding, item embedding. [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)
- **Neural models**:  
  - User embedding + item embedding + context features → MLP / RNN / Transformer. [library.ucsd](https://library.ucsd.edu/dc/object/bb8503744c/_2_1.pdf)
- **Gradient boosted trees (XGBoost / LightGBM)**: on tabular features (user stats + item stats + interaction stats). [linkedin](https://www.linkedin.com/pulse/designing-scalable-recommendation-system-ml-pipelines-sanobar-k-khan-cqlkc)

Training pipeline:

1. Split historical data into train/validation (time‑based ya random, but usually time‑based to avoid leakage).  
2. Feature preprocessing (categorical encoding, normalisation, etc.).  
3. Model fit (`model.fit(...)`).  
4. Evaluation (AUC, logloss, precision@K, recall@K, etc.). [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)

Agar result OK hai:

5. Model artifact save (e.g. serialized file – pickle, ONNX, TorchScript, SavedModel).  
6. Config + versioning store (which features, hyperparams, training time). [stackoverflow](https://stackoverflow.blog/2020/10/12/how-to-put-machine-learning-models-into-production/)

Ye sab **offline** hota hai. End result: “ready‑to‑deploy model + feature definitions”.  

***
## 3. Deployment: model ko production me kaise le jaate hain?
Ab model ko **serving system** me deploy karte hain:

- Option A: dedicated **model server / microservice** (Docker container with model + code).  
- Option B: managed service (e.g. SageMaker Endpoint, Amazon Personalize). [aws.amazon](https://aws.amazon.com/personalize/)

Service responsibility:

- HTTP / gRPC API expose kare: e.g. `GET /recommendations?user_id=123`.  
- Under the hood:  
  - Latest user features + candidate item features fetch kare.  
  - Preprocessing apply kare (same logic as training).  
  - Model se scores compute kare.  
  - Top‑K items return kare. [linkedin](https://www.linkedin.com/pulse/designing-scalable-recommendation-system-ml-pipelines-sanobar-k-khan-cqlkc)

Latency constraints:  
- Home page recommendations → ~tens of milliseconds to a few hundred ms typical budget. [ijetcsit](https://www.ijetcsit.org/index.php/ijetcsit/article/download/577/519)

***
## 4. Online inference flow (User request → Recommendations)
Ab assume trained model deployed hai. Ek actual user flow:
### Step 4.1 User lands on home page
- User `U123` Amazon open karta hai.  
- Front‑end backend ko call karta hai: “Is user ke liye recommendations do”.  

Request → backend → **Recommendation Service**.
### Step 4.2 Candidate generation (coarse filter)
Sab items pe score nikalna lakhon products pe expensive hai, to pehle **candidate generation** hota hai:

- Simple rules / precomputed lists se ~100–1000 candidate items nikale jate hain:
  - Top trending items.  
  - Items similar to last viewed item (item‑to‑item collaborative filtering).  
  - Items from categories user generally likes. [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)

Ye part non‑ML bhi ho sakta hai ya simpler models se ho sakta hai.
### Step 4.3 Feature gathering
For each candidate item:

- User features:  
  - Long‑term profile from feature store (precomputed offline).  
  - Short‑term session signals (current session clicks/searches, often from in‑memory store or streaming). [aws.amazon](https://aws.amazon.com/blogs/architecture/architecting-near-real-time-personalized-recommendations-with-amazon-personalize/)

- Item features:  
  - Static features (category, price, brand).  
  - Possibly offline‑computed embeddings.  

- Context features:  
  - Time of day, device type, current page, campaign info.  

Backend yeh sab join karke **feature vector** banata hai:  

\[
x = f(\text{user}, \text{item}, \text{context})
\]
### Step 4.4 Model scoring
- In feature vectors ko model server ko diya jata hai (batch me).  
- Model har candidate ke liye score out karta hai, e.g. “probability of click / buy”. [baeldung](https://www.baeldung.com/cs/amazon-recommendation-system)

Example:

- Candidate items: 200 items.  
- Model outputs: 200 scores.
### Step 4.5 Ranking + post‑processing
- Scores ke basis pe sorting / ranking hoti hai.  
- Post‑processing rules:  
  - Diversity (sirf ek hi category ka spam na ho).  
  - Business constraints (out‑of‑stock nahi dikhana, regulatory filters, etc.).  
  - Maybe some rules for sponsored ads, etc. [argoid.findableis](https://argoid.findableis.com/blog/decoding-amazons-recommendation-system.html)

Final list → top 20 items → backend → front‑end → user ko dikhte hain.  

Ye sab **online inference** pipeline hai.  

***
## 5. Feedback loop and retraining
Production me system static nahi rehta:

1. User recommended items dekh ke click / buy / ignore karta hai.  
2. Ye interactions phir se events ke form me log hote hain (clickstream, purchases). [aws.amazon](https://aws.amazon.com/blogs/architecture/architecting-near-real-time-personalized-recommendations-with-amazon-personalize/)
3. Events data lake / warehouse me add ho jata hai.  
4. Periodically (daily/weekly/monthly) offline pipeline fresh data se **retrain** / **fine‑tune** models:  
   - Naya behavior, seasonality, trends capture hote hain. [intuz](https://www.intuz.com/blog/e-commerce-recommendation-system-using-mlops)

Thus, production system me:  
- Online part = inference + logging.  
- Offline part = retraining + A/B testing + model selection.  

***
## 6. Where does data leakage fit in this story?
Same Amazon scenario me leakage ka matlab:

- Agar training time pe tumne features use kiye jo **deployment time pe available hi nahi honge** (e.g. “did user return this product later?”, “final sale price”, “post‑purchase review”), to:  
  - Offline metrics super high.  
  - Online runtime pe wo features missing, to model performance collapse / weird behavior. [mlinproduction](https://mlinproduction.com/data-leakage/)

Isliye:

- Feature design me hamesha socho:  
  - “Kya yeh feature user ke action ke *pehle* available hoga?”  
  - “Training pipeline jo stats compute kar raha hai, kya woh sirf past data pe based hai, ya future ka leak ho raha hai?” [linkedin](https://www.linkedin.com/pulse/ml-nugget-3-data-leakage-silent-model-killer-rishabh-iyer-gaguf)

***

If you want, next step me main isi example ko ek short **system design answer template** bana sakta hoon (2–3 paragraphs + simple diagram‑style bullet flow) jo tum interviews / design docs me use kar sako, e.g. “Design an e‑commerce recommendation system end‑to‑end”.