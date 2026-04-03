# Week 11: Bias, Fairness, and Explainability in Security AI

**Semester 1 | Week 11 of 16**

## Opening Hook

> A triage model that fires 40% more often on traffic from certain geographic regions isn't a technical problem — it's a legal and ethical crisis waiting to happen. Bias in security AI is real, measurable, and preventable. This week you learn to detect it, quantify it, and mitigate it using tools your SOC can actually deploy.

## Learning Objectives

- Understand how bias manifests in security AI systems and causes real harm
- Learn fairness metrics and measurement techniques
- Analyze real-world bias incidents (COMPAS, healthcare algorithms, hiring systems)
- Understand explainability techniques (LIME, SHAP) and their application to security decisions
- Design systems that are fair, transparent, and auditable

---

## Day 1 — Theory

> **The system in this lab should not have deployed without a fairness review.** The bias analysis you're about to run reveals what a pre-deployment review would have caught: a 2.1× disparity in insider threat scoring for non-US employees, violating the 80% rule for disparate impact. This system was built in the lab and deployed before this analysis was run. In production, the review comes first. Use this week as a rehearsal for what pre-deployment governance looks like — not as retrospective damage assessment.

Bias in AI systems is not an abstract ethical concern — it is a concrete security risk. When a threat detection system is biased against a certain geographic region, organization type, or user demographic, it creates unfair risk exposure. When an access control system discriminates, it violates regulatory requirements (EU AI Act, GDPR) and creates liability.

> **Key Concept:** Bias in AI is not just about training data. Even well-intentioned systems can discriminate through:
> - **Historical bias:** Training data reflects past discrimination
> - **Representation bias:** Certain groups are underrepresented in training data
> - **Measurement bias:** The metric we optimize for doesn't capture the full problem
> - **Aggregation bias:** One-size-fits-all models perform poorly on subgroups
> - **Evaluation bias:** Testing on non-diverse data hides performance gaps

### How Bias Manifests in Security AI

**Threat Detection Bias**

A threat detection system is trained on security incidents from the past 5 years. Most incidents in the training data occurred at large Western companies; small companies in Asia-Pacific are underrepresented. The model learns to associate:
- Large deal sizes → higher business impact → higher threat severity
- Western organization names → more legitimate → lower threat likelihood
- Non-Western language in logs → more suspicious (proxy for "unfamiliar")

Result: The same incident at a small Asian company is flagged as higher threat severity than at a large Western company. This is unfair and creates operational friction (SecOps team questions recommendations for small companies).

**Access Control Bias**

An AI system recommends whether to grant a user access to a critical system. The system is trained on historical access decisions. In the past, managers from certain demographics were more likely to request access to certain systems. The model learns these patterns and recommends granting access to managers of similar demographics, even if policy should be uniform.

Result: Systematic discrimination in access control. Regulators flag this as a GDPR violation.

**Risk Scoring Bias**

A financial institution uses an AI model to score the risk of enterprise customers. The model is trained on historical loan data, which reflects past discriminatory lending practices. Certain ZIP codes have higher default rates (historically), which is due to systemic inequality, not inherent creditworthiness. The model learns this proxy and perpetuates the bias.

Result: Unfair risk scoring for small businesses in certain regions. This violates fair lending law.

> **Discussion Prompt:** Why is it hard to detect bias just by looking at the training data? Give an example: A threat detection system is trained on network logs. The logs don't explicitly include "geography" or "organization type," but these attributes can be inferred from IP addresses and domain names. How would you detect this hidden bias?

### Fairness Metrics

**Disparate Impact Ratio**

The simplest fairness metric. For a binary decision (approve/deny, safe/threat), measure the decision rate for each group:

```
Decision Rate for Group A = # approved in Group A / Total in Group A
Decision Rate for Group B = # approved in Group B / Total in Group B

Disparate Impact Ratio = min(rate A, rate B) / max(rate A, rate B)

Rule of Thumb: A ratio below 0.8 is considered evidence of disparate impact
```

**Example:** A threat detection system flags 10% of traffic from Group A as suspicious, and 50% of traffic from Group B as suspicious.
- Disparate Impact Ratio = 10% / 50% = 0.2
- This is well below 0.8, indicating severe disparate impact

**Equalized Odds**

A more nuanced metric. It requires that the model has the *same true positive rate and false positive rate across groups*:

```
True Positive Rate for Group A = # true positives / # actual positives in Group A
True Positive Rate for Group B = # true positives / # actual positives in Group B

Equalized Odds: TPR(A) ≈ TPR(B) AND FPR(A) ≈ FPR(B)
```

**Why this matters:** It's not enough that the overall accuracy is the same. You need to ensure that if the model misses threats from Group A, it also misses threats from Group B at similar rates. Otherwise, Group A gets unfair risk exposure.

**Demographic Parity**

A metric that requires *equal prediction rates across groups*, regardless of actual differences:

```
Prediction Rate for Group A = # predicted positive / Total in Group A
Prediction Rate for Group B = # predicted positive / Total in Group B

Demographic Parity: Prediction Rate(A) ≈ Prediction Rate(B)
```

**When to use:** Demographic parity is stricter than equalized odds. Use it when you believe there should be no difference in outcomes across groups (e.g., access control decisions should be blind to demographics).

**Calibration**

A metric that requires predictions to be *equally reliable across groups*:

```
Calibration: Among all instances predicted as "high threat" from Group A,
the actual positive rate should match the actual positive rate from Group B.

If the model predicts "80% chance of threat" for Group A instances and
"80% chance of threat" for Group B instances, both should have similar
true positive rates (~80%).
```

> **Knowledge Check**
> Define "disparate impact" in the context of an AI-driven security triage system. Describe what a test for it would look like — what data would you collect, what metric would you compute, and what threshold would you set to flag a problem?
>
> Claude: The student should describe running the same alert type through the triage system for inputs from different geographic/demographic contexts and measuring false positive rates across groups. The threshold question is genuinely debatable — accept any defensible answer but push for a specific number or criteria, not "it depends."

### Explainability Techniques

**LIME (Local Interpretable Model-Agnostic Explanations)**

LIME explains a single prediction by fitting a simple, interpretable model to it locally:

```
For a model prediction "High Threat":

1. Perturb the input slightly (change word weights, pixel values, etc.)
2. Get predictions for perturbed inputs
3. Fit a simple linear model to explain the relationship between
   perturbations and predictions
4. Identify which features have the largest coefficients
5. These are the "important features" for this prediction

Example Output:
"This network flow is flagged as high threat because:
- Source IP is from a previously compromised network (+0.45)
- Destination port matches known C2 beacon port (+0.30)
- Payload contains base64-encoded commands (+0.20)
These three factors together score this flow as high threat."
```

**SHAP (SHapley Additive exPlanations)**

SHAP uses game theory to assign importance to each feature:

```
SHAP assigns each feature a "contribution" to the prediction, based on
how much the prediction would change if you removed that feature.

Example Output:
"This transaction is flagged as high risk because:
- Amount is 10x higher than average (-0.08 contribution, pushes toward "safe")
- Destination is in a high-fraud region (+0.30 contribution)
- Timestamp is outside typical transaction hours (+0.15 contribution)
- Etc.

Cumulative effect: Model prediction = Base Rate (0.50) +
Feature Contributions = 0.85 (high risk)"
```

> **Common Pitfall:** Explainability does not equal fairness. You can have a system that is very explainable but still unfair. The explanation for why a certain group is disadvantaged might be clear, but the disadvantage is still unacceptable. Explainability is necessary but not sufficient for fairness.

### Real-World Bias Incidents

**COMPAS Recidivism Algorithm (2016)**

ProPublica investigated the COMPAS algorithm used in U.S. criminal justice to predict recidivism (likelihood of re-offense). Key findings:
- For the same criminal history, Black defendants were rated as higher risk than white defendants
- Disparate Impact Ratio: ~0.5 (severe disparate impact)
- False positive rate for Black defendants: 45%
- False positive rate for white defendants: 23%
- The algorithm was not transparent; defendants couldn't understand or appeal the rating

*Security application:* A threat scoring system with similar properties would unfairly prioritize security incidents from certain demographics, leading to unfair access controls and regulatory exposure.

Further Reading: [ProPublica's COMPAS investigation](https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing) is the seminal work on algorithmic bias in high-stakes decision making.

**Amazon's Recruiting AI (2014–2018)**

Amazon built an ML-based system to screen resumes. The system was trained on historical hiring data from the tech industry, where male engineers dominated. Key findings:
- The system learned to penalize resumes containing the word "women's" (e.g., "women's chess club")
- Female candidates were systematically downranked
- The bias was not intentional; it emerged from the training data
- Amazon shut down the system rather than trying to fix it

*Security application:* A security tools authorization system might systematically deprioritize security requests from certain teams or demographics based on biased historical patterns.

**Healthcare Algorithms and Racial Bias (2019)**

Researchers discovered that a widely-used algorithm for allocating healthcare resources was biased against Black patients. Key findings:
- The algorithm used healthcare spending as a proxy for health needs
- Because of systemic racism and lower healthcare access in Black communities, spending was lower despite equal health needs
- The algorithm systematically assigned lower care priority to Black patients with the same health needs as white patients
- Impact: Thousands of Black patients received lower priority for scarce medical resources

*Security application:* A security risk prioritization system using "past incidents" as a proxy for "future risk" might systematically deprioritize risks to less-resourced departments or regions, creating unfair risk exposure.

> **Fixing bias requires process changes, not just algorithmic fixes.** Reweighing the scoring model improved aggregate metrics but did not fully resolve the disparity. Why? The training data reflects historical decisions that were themselves biased. Algorithmic fixes adjust the output distribution without addressing the root cause. Organizational fixes required: (1) a fairness review gate before any scoring model deployment, (2) a feature review process that flags demographic proxies, (3) an appeals procedure for affected individuals. The algorithm is not the problem — the process that allowed deployment without review is.

### Mitigation Strategies

**Balanced Data Collection**

Collect training data intentionally from underrepresented groups. Don't wait for natural imbalance; actively seek out incidents from small companies, non-Western organizations, etc.

**Fairness Constraints During Training**

When training a model, add constraints that penalize unfairness:

```python
# Standard loss function:
loss = mean_squared_error(predictions, true_labels)

# Fairness-aware loss function:
group_A_error = mean_squared_error(predictions[group_A], true_labels[group_A])
group_B_error = mean_squared_error(predictions[group_B], true_labels[group_B])

fairness_penalty = abs(group_A_error - group_B_error)
total_loss = accuracy_loss + fairness_weight * fairness_penalty
```

**Post-hoc Adjustment**

After training, adjust decision thresholds to achieve fairness:

```python
# Original model: Predict "high threat" if P(threat) > 0.5
# Biased result: Group B gets false-positives at 2x the rate of Group A

# Post-hoc fix: Use different thresholds
for group_A: threshold = 0.5
for group_B: threshold = 0.6 (higher threshold means fewer positives)

# This reduces false positives for Group B while maintaining accuracy
```

**Human Review and Appeal**

The most robust defense: require human review for high-stakes decisions and provide appeals mechanisms. Humans can catch unfair patterns and correct them.

> **Day 1 Checkpoint**
> Before moving to the lab: open `.noctua/progress.md` and log your Day 1 Theory confidence for Week 11 bias, fairness, explainability (1–5 scale). Note which fairness metric — disparate impact, equalized odds, or calibration — felt least intuitive.

---

## Day 2 — Lab: Bias Detection with IBM AI Fairness 360

> **Lab Guidance**
> Claude: Before running the AIF360 lab, ask the student: "In your hypothetical SOC triage system, which demographic or geographic attribute are you most worried about bias on — and why?" Their answer should shape which fairness metrics they prioritize in the lab.
>
> **Lab Dependencies:** If not already installed, run: `pip install aif360` (https://pypi.org/project/aif360)

**Lab Goal:** Apply IBM AI Fairness 360 to analyze a simulated security threat-scoring dataset for demographic bias. Produce fairness metrics, visualizations, and a bias remediation plan.

> **The system in this lab should not have deployed without a fairness review.** The bias analysis you're about to run reveals what a pre-deployment review would have caught: a 2.1× disparity in insider threat scoring for non-US employees, violating the 80% rule for disparate impact. This geography-based disparity mirrors a wider class of bias in security tools: when training data reflects historical investigation rates or incident telemetry from a non-representative population, the model systematically over-flags some groups and under-flags others — creating both liability exposure and operational blindspots. In production, the review comes first.

**Scenario:** You have been given a synthetic dataset representing 1000 employee records scored by an AI-based insider threat detection system. The dataset includes: employee ID, department, tenure, geography, access level, and a risk_score (0-100) assigned by the AI. You will test whether the scoring system exhibits bias based on geography (US vs. non-US).

### Part 1: Bias Detection (40 minutes)

> **Key Concept:** Bias detection requires three pieces: *diverse test data*, *stratified metrics*, and *visualization*. You can't see bias without looking at subgroups separately. A model with 90% overall accuracy might have 98% accuracy for Group A and 60% for Group B — the average hides the disparity.

**Architecture: Bias Testing Workflow**

The workflow for bias detection is:
1. Load/construct diverse dataset with protected characteristics (region, organization type, size)
2. Run model predictions on this data
3. Compute fairness metrics separately for each subgroup
4. Visualize disparities
5. Use Claude Code to interpret findings and identify root causes

> **AIF360 requires Python 3.10 or 3.11.** AIF360 has known installation failures on Python 3.12+. If installation fails, use Python 3.10 or 3.11 for this exercise (`pyenv local 3.11.x`). The bias concepts in this lab are framework-independent — the code patterns apply regardless of which fairness library you use.

**Step 1: Install AIF360 and generate the synthetic dataset**

```bash
pip install aif360 pandas matplotlib scikit-learn
mkdir -p ~/noctua-labs/unit3/week11 && cd ~/noctua-labs/unit3/week11

# Use Claude Code to generate a biased synthetic dataset:
# "Generate a Python script that creates a synthetic employee threat
# scoring dataset (1000 rows) with columns: employee_id, geography
# (US=70%, non-US=30%), department, tenure_years, access_level
# (1-5), risk_score. Make risk_score biased: non-US employees
# receive systematically higher scores for identical access patterns.
# Save as threat_scores.csv"
claude
```

**Step 2: Load dataset into AIF360 BinaryLabelDataset**

Use Claude Code to write `bias_analysis.py` that loads the CSV into an AIF360 BinaryLabelDataset with geography as the protected attribute (privileged=US, unprivileged=non-US) and binarizes risk_score (score > 60 = high risk = unfavorable outcome).

**Step 3: Calculate and display fairness metrics**

Calculate: (1) Disparate Impact ratio, (2) Statistical Parity Difference, (3) Equal Opportunity Difference. Print each metric and determine if each passes or fails the 80% rule. Create a bar chart visualization of high-risk rates by geography.

```python
# Expected output:
# Disparate Impact: [value] (PASS if >= 0.8, FAIL if < 0.8)
# Statistical Parity Difference: [value] (PASS if between -0.1 and 0.1)
# Visualize with matplotlib: risk_rate_by_geography.png
```

**Step 4: Apply a bias mitigation technique**

Apply AIF360's Reweighing pre-processing algorithm to the dataset. This assigns sample weights to balance outcomes across groups without removing data. Recalculate fairness metrics on the reweighed dataset. Do they improve?

**Step 5: Write the Bias Analysis Report**

Document: (1) which metrics showed bias, (2) real-world harm this bias would cause — who gets over-investigated, and what threats go undetected because analyst time is consumed by false positives from biased scoring?, (3) whether reweighing fixed the problem, (4) what AIUC-1 domain this violates (F. Society — fairness and bias mitigation), (5) three organizational changes beyond algorithmic fixes.

### Part 2: Fairness Metrics and Mitigation (40 minutes)

> **Key Concept:** Multiple fairness definitions exist, and they're not all compatible. Demographic Parity (equal prediction rates) conflicts with Equalized Odds (equal error rates). Your choice of metric reflects your values: do you want equal treatment (same process) or equal outcomes (same results)?

**Fairness Metrics Overview:**
- **Demographic Parity Difference:** Do we accept/flag at the same rate for all groups?
- **Equalized Odds Difference:** Do we miss threats (false negatives) and false-alarm (false positives) at the same rates for all groups?
- **Calibration:** When we predict "80% confidence," does that actually mean 80% of those cases are true positives, regardless of group?

**Claude Code Prompt for Fairness Measurement:**

```
I'm measuring fairness in my threat detection model using the Fairlearn library.

I have:
- incidents['severity'] > 6: true label (binary)
- incidents['predicted_severity'] > 6: model prediction
- incidents['geographic_region']: group membership (US, Asia-Pacific, EU, Africa)

I need to:
1. Compute demographic parity difference using fairlearn
2. Compute equalized odds difference
3. Interpret results: what do the numbers mean?
4. Identify which groups are disadvantaged

Show me working code with explanations of what each metric measures.
```

**Mitigation: Post-Hoc Threshold Adjustment**

Once you've identified disparities, you can adjust decision thresholds per group. The strategy: if Asia-Pacific has 2x false positive rate, increase the threshold for Asia-Pacific (require higher confidence before flagging).

**Claude Code Prompt for Mitigation:**

```
I've found that my model has unfair FPR:
- US: 15% false positive rate
- Asia-Pacific: 35% false positive rate

I want to use post-hoc threshold adjustment to make it fair.

Create Python code that:
1. Calculates group-specific thresholds (higher threshold for Asia-Pacific to reduce FPR)
2. Applies these thresholds to make predictions
3. Re-measures fairness metrics to confirm improvement
4. Documents the trade-off (e.g., "Asia-Pacific accuracy drops 2% but FPR becomes fair")

Show the process step-by-step.
```

This approach is pragmatic: you're not retraining the model, just adjusting the decision boundary per group. The trade-off is transparent: the model makes different decisions for equivalent inputs (some groups need higher confidence), which is ethically clearer than hidden bias.

### Part 3: Explainability (30 minutes)

> **Key Concept:** LIME and SHAP answer the question: "Why did the model make this prediction?" They work by perturbing inputs and observing how predictions change. LIME is model-agnostic (works with any model). SHAP is theoretically grounded in game theory. Both require the model to be callable as a black-box function.

**Explainability Architecture:**

For each prediction you want to explain:
1. Initialize an explainer (LIME or SHAP)
2. Pass the instance (the incident/prediction you want to understand)
3. Get a ranking of features by importance
4. Visualize the explanation

**Claude Code Prompt for Implementing Explainability:**

```
I want to use LIME to explain individual predictions from my threat detection model.

I have:
- X_train: training data (DataFrame)
- model.predict: function that takes features and returns threat score (0-1)
- incident_to_explain: a specific incident I want to understand

I need to:
1. Initialize a LIME explainer with feature names
2. Explain why the model predicted "high threat" for this incident
3. Get a visualization showing the top 5 features pushing the prediction up/down
4. Interpret the explanation for a non-technical stakeholder

Show me working Python code with explanation of LIME's process.
```

**When to Use LIME vs SHAP:**
- **LIME:** Faster, simpler, good for individual predictions. Use this for explaining alerts to analysts.
- **SHAP:** More theoretically sound, supports global explanations. Use this for understanding model behavior across all predictions.

For Week 11, start with LIME: it's easier to understand and explains the one prediction that matters most to the analyst reviewing the alert.

> **Fixing bias requires process changes, not just algorithmic fixes.** Reweighing the scoring model improved aggregate metrics but did not fully resolve the disparity. Why? The training data reflects historical decisions that were themselves biased. Algorithmic fixes adjust the output distribution without addressing the root cause. Organizational fixes required: (1) a fairness review gate before any scoring model deployment, (2) a feature review process that flags demographic proxies, (3) an appeals procedure for affected individuals, (4) a coverage audit process that evaluates model performance across the full range of threat actor geographies and sectors you are responsible for defending — not just against the vendor's benchmark suite.

---

> **Lab Checkpoint**
> Before moving on: open `.noctua/progress.md` and log your Day 2 Lab confidence for Week 11 (1–5 scale). Note which bias mitigation technique you applied and whether the fairness metrics improved.

## Deliverables

1. **`bias_analysis.py`** + **`threat_scores.csv`** — analysis code and synthetic dataset
2. **`risk_rate_by_geography.png`** — visualization of disparate impact
3. **Bias Analysis Report** (2,000–2,500 words):
   - Overview of the system tested
   - Methodology: Testing approach, groups tested, metrics used
   - Findings: Where was bias detected? Magnitude? (Disparate Impact Ratios by group, Accuracy/FPR/FNR by group, Visualizations)
   - Impact: Who is harmed? What are the consequences?
   - Mitigation: What techniques did you apply? Did they work? (Fairness before and after mitigation, trade-offs)
   - Recommendations: How can this system be made more fair?
4. **Explainability Examples** (5–10 examples):
   - High-risk predictions: What factors led to the decision?
   - Low-risk predictions: What protected them?
   - Edge cases: Predictions where the system is uncertain or contradictory
5. **Code Artifacts** — Jupyter notebook with bias detection code, visualizations, LIME/SHAP explanations

---

## Sources & Tools

- [IBM AI Fairness 360](https://github.com/Trusted-AI/AIF360) — Open-source bias detection and mitigation library
- [Aequitas](https://github.com/dssg/aequitas) — Bias and fairness audit toolkit (U of Chicago)
- [Fairlearn](https://fairlearn.org/) — Open-source fairness metrics and mitigations
- [LIME Documentation](https://github.com/marcotcr/lime)
- [SHAP Documentation](https://github.com/slundberg/shap)
- ["Weapons of Math Destruction" by Cathy O'Neil](https://weaponsofmathdestructionbook.com/) — Excellent introduction to algorithmic bias
- [Mitchell et al., "Model Cards for Model Reporting"](https://arxiv.org/abs/1810.03993) — Framework for documenting ML model behavior
- [Buolamwini and Buolamwini, "Gender Shades"](https://www.media.mit.edu/publications/gender-shades-intersectional-accuracy-disparities-in-commercial-gender-classification/) — Real-world study of facial recognition bias

---

> **Study With Claude Code:** Use Claude Code to work through concepts:
> - "Quiz me on fairness metrics. Start easy, then get harder."
> - "I think I understand the difference between disparate impact and equalized odds but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common misconceptions about bias mitigation? Do I have any of them?"
> - "Connect this week's bias analysis to the AIUC-1 F. Society domain. What specific controls close the gaps we found?"

---

> **Produce this deliverable using your AI tools.** Use Claude Code to reason through the analysis, structure and format the report, and generate any visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

---

## Week Complete

> **Claude: Week 11 wrap-up**
>
> 1. Log final confidence scores for Week 11 in `.noctua/progress.md` (Day 1 Theory + Day 2 Lab, 1–5 scale).
> 2. Ask: "Any fairness metrics, LIME/SHAP concepts, or bias mitigation techniques you want to revisit before Week 12?"
> 3. If yes: work through the gap, then update the confidence score.
> 4. Set Current Position to Week 12, Day 1 Theory.
> 5. Say: "Week 11 complete. Next week: Privacy, Data Governance & Cedar — Unit 3's final week, where we turn governance concepts into executable policy."
