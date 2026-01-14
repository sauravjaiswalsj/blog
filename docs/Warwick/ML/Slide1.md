The slide deck introduces machine learning and data mining, motivating them through biomedical applications, fundamental definitions, philosophical underpinnings of representation learning, and a concrete pathology use case, plus a brief look at large models and course logistics.[1]

## Module and motivation

- The module “Machine Learning Algorithms and Practice” (CS909) aims to teach learning from data with applications in biomedicine, including protein function prediction and computational pathology.[1]
- It motivates ML and data science via “big data,” growing storage/compute, and the need for predictive and prognostic insights in domains like biology and medicine. 

## Core ML concepts

- The slides define **machine** learning as making computers learn tasks from existing data, distinguish it from AI and data mining, and introduce deep learning as using neural networks.   
- Through visual and numerical examples (apples, paintings, sequences, vectors), they map everyday reasoning tasks to ML tasks such as classification, clustering, regression, dimensionality reduction, anomaly detection, and reinforcement learning. 

## Philosophical foundations and representations

- The “philosophy of ML” section states that entities have representations, representations can be contextual and generative, can be developed inductively from data, and must support causal reasoning at appropriate complexity.   
- The deck links these philosophical points to algorithms and ideas such as feature/representation learning (convolutions, transformers, graph layers), generative models (GANs, diffusion), self-supervised learning, and structural risk minimization. 

## Basic algorithms and examples

- The material introduces simple geometric views of classification in feature space, including linear decision boundaries and nearest neighbor / k-NN classification, with links to interactive demos and a Python warm-up lab.   
- It emphasizes the pipeline of a data mining system: identifying objectives, defining the unit of classification, representing sensor data, and producing predictions from real-world phenomena. 

## Applications and course framing

- Several biomedical and pathology applications are presented, including digital and computational pathology workflows and colorectal cancer biopsy screening, citing recent studies and tools (e.g., Paige Prostate, CoBI).   
- The slides briefly highlight Nobel prizes related to ML, large language and multimodal models and their emergent properties, and end with ungraded questions/reading plus a reflective quote about building machines that “will be proud of us.”

[1](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/minhas-ml-1-introduction.pdf)


Here are concise, exam‑oriented notes for the slide deck.[1]

***

## Module, goals and motivation

- Module: **Machine** Learning Algorithms and Practice (CS909), focus on learning from data with biomedical applications (protein function, computational pathology, lab medicine, patient trajectories).[1]
- Motivation: Big biomedical data → need predictive and prognostic insights in biology, pathology, and precision medicine.   
- Broader context: Age of “Big Data” and “AI”; storage, transmission and processing power are rapidly increasing. 

***

## Core ML tasks and definitions

- Everyday examples (apples, paintings, sequences, odd-one-out, driving) map to ML tasks:
  - Classification, clustering, regression, dimensionality reduction, anomaly detection, reinforcement learning, next‑element prediction.   
- Key definitions:  
  - Computers are **dumb**; AI = making machines perform intelligent tasks.   
  - Machine Learning = making computers learn tasks from existing data.   
  - Data Mining = mining patterns in data for understanding and prediction.   
  - Deep Learning = solving ML tasks with deep neural networks. 

***

## Why learning from data?

- Deduction vs induction: ML largely uses inductive, bottom‑up reasoning from examples (e.g., genome sequences).   
- Data science is important because humans externalize huge amounts of data and can now process it with powerful computation.   
- Recent Nobel prizes highlight impact of ML on neural networks and protein design/structure prediction.   

***

## Large models and emergent behavior

- Large language and multimodal models are positioned as part of a data mining / ML toolkit, enabling pattern discovery and knowledge extraction from large datasets.   
- Emergent properties: complex abilities can arise in large models (e.g., embodied agents such as Voyager using LLMs).   
- Global AI impact resources referenced (Our World in Data AI pages). 

***

## Data mining system pipeline

- Constructs of a predictive data mining system:   
  - Identify objective.  
  - Identify unit of classification (image block, protein sequence, etc.).  
  - Sensor → representation → prediction → decision on real‑world phenomena.  
- Emphasizes representation as the bridge between raw sensor data and ML decisions. 

***

## Philosophical foundations of ML

- Stated philosophical principles:   
  1. Entities have explicit or implicit **representations**.  
  2. Semantic relatedness is context dependent → representations are contextual.  
  3. Representations can allow reconstruction/generation of entities (to a sufficient degree).  
  4. Representations can be developed inductively from empirical observations.  
  5. Effective, adaptive goal‑directed behavior needs causal representations at appropriate complexity.  
- Illustrations: ambiguity of the word “bank,” transformers/cars, Kepler and induction, US Airways Flight 1549 for causal reasoning. 

***

## From philosophy to algorithms

- Mapping philosophy → algorithms:   
  - Representation learning: features via convolutions, transformers, graph layers (I, II).  
  - Generative models: GANs, latent diffusion (III).  
  - Learning algorithms: gradient descent, self‑supervised learning, next‑word prediction (IV).  
  - Reinforcement learning and structural risk minimization to control model and representation complexity (V).  

***

## Example: computational pathology pipeline

- Conventional histopathology: tissue acquisition → block prep → slide prep + dyes → microscopy → clinical decision.   
- Digital pathology: same, plus whole‑slide scanning; brings flexibility and equivalence to glass slides but does not by itself solve workload issues.   
- Computational pathology: adds AI‑assisted clinical decision making on whole‑slide images (e.g., Paige Prostate).   

***

## How ML works (simple geometric view)

- Example: breast cell annotation (tumor vs other cells) using features like size and brownness in a 2D feature space.   
- Points in feature space labeled as positive/negative examples; decision regions separate classes.   
- Simple linear classifiers: decision boundary defined by \(f(x) = w_1 x_1 + w_2 x_2 + b = 0\); goal is generalization to unseen data. 

***

## Nearest neighbor and k‑NN

- k‑NN classification: distance‑based rule on feature vectors; example with 2D points and Euclidean distance \(D(x_a,x_b)\).   
- Demo and lab: k‑NN decision regions, discussion about whether k‑NN is a good rule and whether data are linearly separable.   
- Interactive AND‑neuron example connects linear classifiers to simple neural units; XOR‑style case used to show limitations of linear separability. 

***

## Practical case study: CoBI

- Problem: colorectal cancer; need efficient screening of colonic biopsies.   
- CoBI (Colonic Biopsy Screening): classify colorectal tissue samples as normal vs abnormal.   
- Recent work: multi‑task histology models and interpretable graph learning can automate classification and reduce review of normal slides by up to 33% at 99% sensitivity. 

***

## Revision / reflection questions

- Conceptual questions (for self‑study):   
  - What is a feature representation and feature space?  
  - Philosophical foundations of ML?  
  - What is linear separability?  
  - What applications suit ML and which would you like to build?  
  - What is missing in the philosophical foundations discussed?  
- Closing quote: aspiration to build machines that “will be proud of us” (Danny Hillis).

[1](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs909/minhas-ml-1-introduction.pdf)