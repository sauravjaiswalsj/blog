
# CS430/910 – Foundations of Data Analytics  
_Exam‑focused Notes – Lecture 1 (Intro)_  

## 1. Core definitions

- **Data analytics**: Science of studying data to draw conclusions and support decision‑making.[2]
- **Data**: Raw, often large‑scale information (e.g. web logs, sensor data, transactions) that needs processing before it is useful.[3][4]
- **Knowledge**: Patterns or models extracted from data that can be used to explain, predict, or support actions.[4]

***

## 2. Typical data representation

- Data is usually represented as a **table/matrix**:  
  - Rows = records / data points (e.g. customers, patients).  
  - Columns = attributes / features (e.g. age, income, diagnosis).[5]
- Practical issues:  
  - Many more rows than columns.  
  - Attributes may be correlated or redundant.  
  - Data can be noisy, incomplete, and inconsistent.[6][5]

***

## 3. Data preprocessing

### Why preprocessing is important

- Real‑world data is often:  
  - Incomplete (missing values).  
  - Noisy (errors, outliers).  
  - Inconsistent (conflicting values across sources).[6]
- Poor data quality ⇒ unreliable models and incorrect conclusions.[7][6]

### Main preprocessing steps (know these names)

- **Data cleaning**: handle missing values, smooth noise, detect/remove outliers.[7][6]
- **Data integration**: combine data from multiple sources into a coherent dataset.[6]
- **Data transformation**: normalize, scale, aggregate, or encode data into more useful forms.[6]
- **Data reduction**: reduce data size while preserving structure (sampling, feature selection, aggregation, clustering).[6]

### Preprocessing philosophy (exam‑style idea)

- Fix obvious problems before modelling, but avoid over‑editing.  
- Aim for minimal, justified changes so that models reflect reality, not artefacts of cleaning.[7]

***

## 4. Main analysis tasks (know definitions + examples)

### Regression

- **Goal**: predict a **numeric** output variable from one or more input variables.[8]
- Idea: fit a function (often a straight line or surface) that minimizes squared errors between predictions and actual values.[9][8]
- Examples:  
  - Predict sales from temperature.  
  - Predict house price from size, location, age.[9]
- Key types (names only for now):  
  - Simple linear regression, multiple linear regression, logistic regression (for categorical outcome but modelled via regression framework).[10]

### Classification

- **Goal**: assign data points to **categories/classes** based on labeled training data.   
- Input: training set of (features, class label) pairs; Output: model that predicts labels for new data.   
- Example applications (good to quote):  
  - Credit scoring (good/bad risk).  
  - Fraud detection.  
  - Medical diagnosis (disease vs no disease).  
  - Spam vs non‑spam emails.   
- Key algorithms (names to remember): Naïve Bayes, Support Vector Machines (SVM), decision trees.   

### Clustering

- **Goal**: group data into clusters where points in the same cluster are more similar to each other than to points in other clusters.   
- Unsupervised: no labels given; the algorithm discovers structure itself.   
- Uses:  
  - Discover natural groupings (e.g. customer segments).  
  - Data reduction (represent clusters instead of all points).  
  - Outlier detection.   
- Example algorithms: k‑means, EM, k‑medoids, hierarchical agglomerative clustering, DBSCAN, Farthest First.   

---

## 5. Case studies (good for short answer questions)

### Google Flu Trends

- Idea: use Google search query data to estimate flu prevalence faster than traditional reporting (about two weeks earlier).[11][12]
- Model: simple logistic‑style regression on aggregated search queries to estimate proportion of flu‑like illness.[12]
- Issue: the system later overestimated flu levels (e.g. by ~50% in 2013), highlighting limitations of models and importance of validation.[13]

### Netflix Prize

- Netflix offered a prize for algorithms that improved its recommender system (Cinematch) by a specified margin.[14]
- Task: predict user ratings for films more accurately than Cinematch; results compared via a leaderboard.[14]
- Importance: drove advances in **collaborative filtering** and evaluation of recommender systems.[14]

***

## 6. Historical context (know key names & ideas)

- **John Tukey** (Exploratory Data Analysis, 1977): emphasised examining data to see what it suggests, introduced tools like the box plot.[15]
- **S and R languages**: S developed at Bell Labs for interactive statistics and graphics; R evolved as an open‑source implementation inspired by S.[16][17]
- **Web & KDD**:  
  - 1989: Tim Berners‑Lee creates the World Wide Web; the web later becomes a major data source.[18]
  - KDD workshops evolve into ACM SIGKDD, a leading conference in knowledge discovery and data mining.[19][20]
- **Data science term**: “Data Science” proposed as a name for statistics in the 1990s, highlighting the focus on data‑centric methods and roles (data scientist).[21]

***

## 7. Ethics, law, and tools (high‑level ideas)

- Working with data involves **privacy, legality, and ethics** (e.g. UK GDPR):  
  - Lawful basis for processing.  
  - Data minimisation and purpose limitation.  
  - Extra care for sensitive/special‑category data.[1]
- Tool mindset: know multiple tools (e.g. WEKA, Python/R, SQL, Unix tools, spreadsheets) and choose the right one for the task; concepts are more important than specific software in exams.[1]

***

If revising under time pressure, prioritise:  
- Definitions + differences between regression, classification, clustering.  
- Preprocessing steps and their purpose.  
- The two case studies and what they illustrate (success and failure of data‑driven methods).

[1-Slide](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs910/2025_l1_intro.pdf)
[2-Coursera](https://www.coursera.org/courses?query=machine+learning+andrew+ng)
[3-Inria](https://inria.github.io/scikit-learn-mooc/)
[4-CognitiveClass](https://cognitiveclass.ai/learn/learn-ai-hands-on-pytorch)
[5-Youtube](https://www.youtube.com/watch?v=L06VjxRv7Lg)
[6-Pytorch](https://docs.pytorch.org/tutorials/beginner/pytorch_with_examples.html)
[7-Kaggle](https://www.kaggle.com/learn/intro-to-machine-learning)
[8-Youtube](https://www.youtube.com/watch?v=E0bwEAWmVEM)
[9-Kaggle](https://www.kaggle.com/code/kanncaa1/machine-learning-tutorial-for-beginners)
[10-Datacamp](https://www.datacamp.com/tutorial/machine-learning-python)
[11-Coursera](https://www.coursera.org/projects/scikit-learn-for-machine-learning-classification-problems)
[12-ZeroToMastery](https://zerotomastery.io/courses/learn-pytorch/)
[13-Reddit](https://www.reddit.com/r/learnmachinelearning/comments/16osn64/how_do_i_use_kaggle_to_learn_and_practice_machine/)
[14-Scikit-learn](https://scikit-learn.org/1.4/tutorial/basic/tutorial.html)
[15-Reddit](https://www.reddit.com/r/learnmachinelearning/comments/rwy8za/do_i_need_study_data_structures_and_algorithms/)
[16-Deeplearning.ai](https://www.deeplearning.ai)
[17-Reddit](https://www.reddit.com/r/learnmachinelearning/comments/18wp0kq/how_timeintensive_is_courseras_machine_learning/)
[18-Youtube](https://www.youtube.com/watch?v=hDKCxebp88A)
[19-Datacamp](https://www.datacamp.com/courses/supervised-learning-with-scikit-learn)
[20-Coursera](https://www.coursera.org/courses?query=scikit+learn)
[21-Youtube](https://www.youtube.com/watch?v=SIEaLBXr0rk)
