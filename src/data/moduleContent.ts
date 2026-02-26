export interface ModuleContent {
  intuition: {
    analogy: string;
    bullets: string[];
    formula: string;
    formulaExplanation: string;
  };
  steps: {
    title: string;
    description: string;
  }[];
  failures: {
    title: string;
    leftLabel: string;
    rightLabel: string;
    leftDescription: string;
    rightDescription: string;
  };
}

export const moduleContents: Record<string, ModuleContent> = {
  'linear-regression': {
    intuition: {
      analogy: "Imagine drawing a straight ruler through a scatter of dots on paper — Linear Regression finds the angle and position of that ruler so it passes as close to every dot as possible.",
      bullets: [
        "Finds the best-fit straight line through data points",
        "Minimizes the total squared distance from each point to the line",
        "Used for predicting continuous values (house prices, temperatures)",
        "The simplest and most interpretable regression model"
      ],
      formula: "ŷ = m·x + b   |   MSE = (1/n) Σ(y - ŷ)²",
      formulaExplanation: "m = slope (how steep), b = intercept (where line crosses y-axis), ŷ = predicted value, MSE = average squared prediction error"
    },
    steps: [
      { title: "Scatter the Data", description: "Plot all data points on a 2D plane. Each point has an input x and output y." },
      { title: "Initialize the Line", description: "Start with a random slope m and intercept b. The line ŷ = mx + b is drawn." },
      { title: "Compute Predictions", description: "For each data point, compute ŷ = m·x + b. These are the predicted values." },
      { title: "Calculate Error (MSE)", description: "Compute the mean squared error: average of (y - ŷ)² across all points." },
      { title: "Find Optimal Parameters", description: "Use the Least Squares formula: m = cov(x,y)/var(x), b = mean(y) - m·mean(x)." },
      { title: "Best-Fit Line", description: "The line now minimizes MSE. It passes as close to all points as possible." }
    ],
    failures: {
      title: "When Linear Regression Fails",
      leftLabel: "Underfitting",
      rightLabel: "Overfitting (with noise)",
      leftDescription: "A straight line on curved data misses the true pattern. The model is too simple.",
      rightDescription: "If we add too many polynomial terms trying to hit every point, we fit noise instead of signal."
    }
  },
  'polynomial-regression': {
    intuition: {
      analogy: "If a straight ruler can't follow the curve of a road, you bend a flexible wire to match it — Polynomial Regression bends the line by adding powers of x.",
      bullets: [
        "Extends linear regression by adding x², x³, etc.",
        "Higher degree = more flexible curve",
        "Degree 1 = linear regression",
        "Risk of overfitting increases with degree"
      ],
      formula: "ŷ = a₀ + a₁x + a₂x² + ... + aₙxⁿ",
      formulaExplanation: "n = degree of polynomial, a₀...aₙ = coefficients found via the normal equation, higher n = more complex curve"
    },
    steps: [
      { title: "Choose Degree", description: "Select polynomial degree n. This determines how many x-powers to include." },
      { title: "Build Feature Matrix", description: "For each x, compute [1, x, x², ..., xⁿ] to create the design matrix X." },
      { title: "Solve Normal Equation", description: "Compute coefficients a = (XᵀX)⁻¹Xᵀy to find the best fit." },
      { title: "Draw the Curve", description: "Plot ŷ = a₀ + a₁x + ... + aₙxⁿ across the data range." },
      { title: "Evaluate Fit", description: "Check MSE. Lower degree may underfit, higher degree may overfit." }
    ],
    failures: {
      title: "Degree Selection Matters",
      leftLabel: "Degree Too Low",
      rightLabel: "Degree Too High",
      leftDescription: "A straight line (degree 1) on curved data — misses the pattern entirely.",
      rightDescription: "A degree-9 polynomial oscillates wildly between points, fitting noise perfectly."
    }
  },
  'logistic-regression': {
    intuition: {
      analogy: "Think of a bouncer at a club deciding yes/no based on a score — Logistic Regression computes a probability score using the sigmoid function and draws the line at 50%.",
      bullets: [
        "Used for binary classification (spam/not spam, pass/fail)",
        "Outputs a probability between 0 and 1 via sigmoid",
        "Decision boundary is where probability = 0.5",
        "Uses cross-entropy loss instead of MSE"
      ],
      formula: "p = 1 / (1 + e^(-(wx + b)))   |   boundary: wx + b = 0",
      formulaExplanation: "w = weight, b = bias, p = probability of class 1, e = Euler's number (~2.718), sigmoid squashes any value to [0,1]"
    },
    steps: [
      { title: "Plot Two Classes", description: "Scatter data points colored by class (0 or 1) on a 2D plane." },
      { title: "Initialize Weights", description: "Start with random weight w and bias b for the linear function z = wx + b." },
      { title: "Apply Sigmoid", description: "Pass z through sigmoid: p = 1/(1+e^-z). This gives probability of class 1." },
      { title: "Classify Points", description: "If p > 0.5, predict class 1. Otherwise, predict class 0." },
      { title: "Draw Decision Boundary", description: "The line wx + b = 0 separates the two classes. Points on each side get different predictions." }
    ],
    failures: {
      title: "Linear Separability",
      leftLabel: "Good Separation",
      rightLabel: "Non-linear Data",
      leftDescription: "When classes are linearly separable, logistic regression draws a clean boundary.",
      rightDescription: "When classes are interleaved or circular, a single line can't separate them."
    }
  },
  'knn': {
    intuition: {
      analogy: "You move to a new neighborhood and ask your K nearest neighbors how they vote — majority wins. KNN classifies a point by polling its closest data points.",
      bullets: [
        "No training phase — it memorizes all data",
        "Classifies by majority vote of K nearest neighbors",
        "K=1 is noisy, K=N always predicts majority class",
        "Distance metric (usually Euclidean) determines 'nearest'"
      ],
      formula: "d = √((x₁-x₂)² + (y₁-y₂)²)   |   class = mode(K nearest)",
      formulaExplanation: "d = Euclidean distance between two points, K = number of neighbors to consider, mode = most frequent class among K neighbors"
    },
    steps: [
      { title: "Store Training Data", description: "KNN doesn't learn parameters — it keeps all training points in memory." },
      { title: "Receive Query Point", description: "A new unlabeled point arrives that needs classification." },
      { title: "Compute All Distances", description: "Calculate Euclidean distance from the query to every training point." },
      { title: "Select K Nearest", description: "Sort distances and pick the K closest training points." },
      { title: "Vote", description: "Count classes among the K neighbors. The most common class wins." }
    ],
    failures: {
      title: "Choosing K",
      leftLabel: "K Too Small (K=1)",
      rightLabel: "K Too Large (K=N)",
      leftDescription: "K=1 creates jagged, noisy boundaries that overfit to individual outliers.",
      rightDescription: "K=N always predicts the overall majority class, ignoring local patterns entirely."
    }
  },
  'kmeans': {
    intuition: {
      analogy: "Imagine placing K flags on a field of scattered people and asking everyone to walk to their nearest flag — then move each flag to the center of its group. Repeat until stable.",
      bullets: [
        "Unsupervised: no labels needed",
        "Partitions data into K clusters",
        "Iterates: assign points → update centroids → repeat",
        "Sensitive to initial centroid placement"
      ],
      formula: "assign: argmin_k ||xᵢ - μₖ||²   |   update: μₖ = mean(points in cluster k)",
      formulaExplanation: "μₖ = centroid of cluster k, ||...|| = Euclidean distance, each point joins the nearest centroid, then centroids move to cluster centers"
    },
    steps: [
      { title: "Choose K", description: "Decide how many clusters to create. This is a hyperparameter." },
      { title: "Initialize Centroids", description: "Place K centroids at random positions in the data space." },
      { title: "Assign Points", description: "Each data point joins the cluster of its nearest centroid." },
      { title: "Update Centroids", description: "Move each centroid to the mean position of all points in its cluster." },
      { title: "Check Convergence", description: "If centroids didn't move (or moved very little), stop. Otherwise, repeat steps 3-4." }
    ],
    failures: {
      title: "Initialization Sensitivity",
      leftLabel: "Good Initialization",
      rightLabel: "Bad Initialization",
      leftDescription: "Centroids start near actual cluster centers → converges to correct grouping quickly.",
      rightDescription: "Centroids start in one corner → algorithm converges to a suboptimal grouping."
    }
  },
  'gradient-descent': {
    intuition: {
      analogy: "Imagine being blindfolded on a hilly terrain and feeling the slope under your feet — you take steps downhill. Gradient descent does the same to find the minimum of a function.",
      bullets: [
        "Iteratively moves toward the function minimum",
        "Step size controlled by learning rate",
        "Too fast = overshoot, too slow = stuck forever",
        "The gradient tells you the steepest uphill direction"
      ],
      formula: "w_new = w - α · f'(w)   |   for f(w) = w², f'(w) = 2w",
      formulaExplanation: "α = learning rate (step size), f'(w) = derivative/gradient at w, we subtract because gradient points uphill but we want to go downhill"
    },
    steps: [
      { title: "Define Function", description: "Choose the loss function to minimize. Here: f(w) = w²." },
      { title: "Pick Starting Point", description: "Choose an initial value for w. This is where optimization begins." },
      { title: "Compute Gradient", description: "Calculate f'(w) = 2w. This tells us the slope at current position." },
      { title: "Update Parameter", description: "Move w in the opposite direction: w = w - α·2w." },
      { title: "Repeat Until Convergence", description: "Keep updating until the gradient is near zero (we're at the minimum)." }
    ],
    failures: {
      title: "Learning Rate Sensitivity",
      leftLabel: "Learning Rate Too Small",
      rightLabel: "Learning Rate Too Large",
      leftDescription: "Tiny steps = extremely slow convergence. May take thousands of iterations to reach minimum.",
      rightDescription: "Huge steps = overshoots the minimum repeatedly, potentially diverging to infinity."
    }
  },
  'feature-scaling': {
    intuition: {
      analogy: "If one feature is measured in kilometers and another in grams, the kilometer feature will dominate distance calculations. Feature scaling puts all features on an equal playing field.",
      bullets: [
        "Essential for distance-based algorithms (KNN, K-Means)",
        "Normalization: scales to [0, 1] range",
        "Standardization: centers at mean=0, std=1",
        "Normalization is more sensitive to outliers"
      ],
      formula: "Norm: (x-min)/(max-min)   |   Std: (x-μ)/σ",
      formulaExplanation: "min/max = feature's range, μ = mean, σ = standard deviation. Normalization bounds values, standardization centers them."
    },
    steps: [
      { title: "Observe Raw Data", description: "Look at feature values. Are they on vastly different scales?" },
      { title: "Choose Method", description: "Normalization for bounded data, Standardization for normally distributed data." },
      { title: "Apply Transformation", description: "Transform each feature value using the chosen formula." },
      { title: "Compare Results", description: "All features now have comparable ranges, enabling fair distance computations." }
    ],
    failures: {
      title: "When Scaling Matters",
      leftLabel: "Without Scaling",
      rightLabel: "With Scaling",
      leftDescription: "Large-range features dominate distance calculations, making small-range features irrelevant.",
      rightDescription: "All features contribute equally to the model, producing better and fairer results."
    }
  },
  'confusion-matrix': {
    intuition: {
      analogy: "Think of a doctor diagnosing patients — the confusion matrix tracks how many sick people were correctly identified (TP), healthy ones wrongly flagged (FP), and missed cases (FN).",
      bullets: [
        "2x2 table for binary classification results",
        "TP, TN, FP, FN capture all prediction outcomes",
        "Precision = TP/(TP+FP), Recall = TP/(TP+FN)",
        "F1 Score balances precision and recall"
      ],
      formula: "Accuracy = (TP+TN)/Total   |   F1 = 2·(P·R)/(P+R)",
      formulaExplanation: "TP = true positive, FP = false positive, FN = false negative, TN = true negative, P = precision, R = recall"
    },
    steps: [
      { title: "Make Predictions", description: "Run your classifier on test data to get predicted labels." },
      { title: "Compare with Truth", description: "Match each prediction against the actual label." },
      { title: "Fill the Matrix", description: "Count TP, FP, FN, TN and place them in the 2x2 grid." },
      { title: "Calculate Metrics", description: "Derive accuracy, precision, recall, and F1 from the matrix cells." }
    ],
    failures: {
      title: "Accuracy Paradox",
      leftLabel: "Balanced Classes",
      rightLabel: "Imbalanced Classes",
      leftDescription: "With 50/50 class split, accuracy is a good metric. All errors are equally visible.",
      rightDescription: "With 95/5 split, predicting all 'majority' gives 95% accuracy but misses all minority cases."
    }
  },
  'roc-curve': {
    intuition: {
      analogy: "Imagine adjusting a smoke detector's sensitivity — too sensitive means false alarms (high FPR), too lenient means missed fires (low TPR). The ROC curve maps this tradeoff.",
      bullets: [
        "Plots True Positive Rate vs False Positive Rate",
        "AUC = 1.0 means perfect classifier",
        "AUC = 0.5 means random guessing",
        "Useful for comparing models across all thresholds"
      ],
      formula: "TPR = TP/(TP+FN)   |   FPR = FP/(FP+TN)   |   AUC = area under curve",
      formulaExplanation: "TPR = sensitivity/recall, FPR = 1 - specificity, AUC summarizes overall classifier quality"
    },
    steps: [
      { title: "Get Probability Scores", description: "Your model outputs probability for each sample, not just class labels." },
      { title: "Vary Threshold", description: "Sweep threshold from 0 to 1. At each threshold, classify samples." },
      { title: "Compute TPR & FPR", description: "At each threshold, calculate the true and false positive rates." },
      { title: "Plot the Curve", description: "Each (FPR, TPR) pair is a point on the ROC curve." },
      { title: "Calculate AUC", description: "The area under the ROC curve summarizes model performance." }
    ],
    failures: {
      title: "Interpreting ROC",
      leftLabel: "Good Classifier (AUC ≈ 0.95)",
      rightLabel: "Random Classifier (AUC ≈ 0.5)",
      leftDescription: "Curve hugs the top-left corner — high TPR with low FPR across most thresholds.",
      rightDescription: "Curve follows the diagonal — the model has no discriminative power."
    }
  },
  'lasso-regression': {
    intuition: {
      analogy: "Lasso is like a strict budget — it forces some spending (coefficients) to exactly zero, effectively choosing which features matter most.",
      bullets: [
        "Adds L1 penalty (sum of |weights|) to the loss",
        "Can shrink coefficients to exactly zero (feature selection)",
        "λ controls regularization strength",
        "Higher λ = fewer non-zero coefficients"
      ],
      formula: "L = MSE + λ · Σ|wᵢ|",
      formulaExplanation: "MSE = prediction error, λ = regularization strength, |wᵢ| = absolute value of each weight. L1 penalty drives weights to zero."
    },
    steps: [
      { title: "Start with Linear Model", description: "Begin with standard regression: ŷ = w₁x₁ + w₂x₂ + ... + b" },
      { title: "Add L1 Penalty", description: "Modify loss to include λ·Σ|wᵢ|, penalizing large weights." },
      { title: "Optimize", description: "Find weights that minimize the combined loss (MSE + penalty)." },
      { title: "Observe Sparsity", description: "As λ increases, some weights become exactly zero — features are eliminated." }
    ],
    failures: {
      title: "Regularization Strength",
      leftLabel: "λ Too Small",
      rightLabel: "λ Too Large",
      leftDescription: "Barely any regularization — model behaves like ordinary regression, may overfit.",
      rightDescription: "All coefficients shrunk to zero — model predicts just the mean, underfitting badly."
    }
  },
  'ridge-regression': {
    intuition: {
      analogy: "Ridge is like a gentle tax on large coefficients — it shrinks them toward zero but never eliminates them entirely, keeping all features in play.",
      bullets: [
        "Adds L2 penalty (sum of weights²) to the loss",
        "Shrinks coefficients but doesn't zero them out",
        "Better when all features are relevant",
        "Closed-form solution exists: w = (XᵀX + λI)⁻¹Xᵀy"
      ],
      formula: "L = MSE + λ · Σwᵢ²",
      formulaExplanation: "MSE = prediction error, λ = regularization strength, wᵢ² = squared weight. L2 penalty shrinks but never zeros weights."
    },
    steps: [
      { title: "Start with Linear Model", description: "Begin with standard regression with all features." },
      { title: "Add L2 Penalty", description: "Add λ·Σwᵢ² to the loss function, penalizing large weights quadratically." },
      { title: "Solve with Modified Normal Equation", description: "Compute w = (XᵀX + λI)⁻¹Xᵀy for the optimal weights." },
      { title: "Compare with Lasso", description: "Notice coefficients shrink but none reach exactly zero." }
    ],
    failures: {
      title: "Ridge vs No Regularization",
      leftLabel: "No Regularization",
      rightLabel: "With Ridge (good λ)",
      leftDescription: "Coefficients can grow very large, fitting noise in the training data.",
      rightDescription: "Coefficients are constrained, leading to better generalization on new data."
    }
  },
  'decision-tree': {
    intuition: {
      analogy: "Think of a game of 20 Questions — at each step, you ask the most informative yes/no question to narrow down the answer. Decision trees do the same with data features.",
      bullets: [
        "Splits data recursively based on feature thresholds",
        "Gini impurity or entropy measures split quality",
        "Deeper trees = more complex, risk overfitting",
        "Easy to interpret and visualize"
      ],
      formula: "Gini = 1 - Σpᵢ²   |   Entropy = -Σpᵢ·log₂(pᵢ)",
      formulaExplanation: "pᵢ = proportion of class i in a node. Gini=0 or Entropy=0 means pure node (all same class)."
    },
    steps: [
      { title: "Start at Root", description: "All data points are in one node. Evaluate possible splits." },
      { title: "Find Best Split", description: "For each feature, find the threshold that maximizes information gain (reduces impurity most)." },
      { title: "Split the Node", description: "Divide data into left/right children based on the best feature threshold." },
      { title: "Recurse", description: "Repeat splitting on each child until max depth reached or node is pure." },
      { title: "Assign Labels", description: "Each leaf node predicts the majority class of its points." }
    ],
    failures: {
      title: "Tree Depth",
      leftLabel: "Too Shallow (depth=1)",
      rightLabel: "Too Deep (depth=10)",
      leftDescription: "A single split can't capture complex patterns. The model underfits severely.",
      rightDescription: "Every data point gets its own leaf — perfect training accuracy but terrible on new data."
    }
  },
  'hierarchical-clustering': {
    intuition: {
      analogy: "Imagine organizing a family reunion — first individuals pair up, then small groups merge into larger ones, forming a hierarchy from individual to extended family.",
      bullets: [
        "Builds a tree (dendrogram) of nested clusters",
        "Agglomerative: starts with individuals, merges upward",
        "Linkage method affects cluster shape",
        "Cut the dendrogram at any level to get K clusters"
      ],
      formula: "Single: min d(a,b)   |   Complete: max d(a,b)   |   Average: mean d(a,b)",
      formulaExplanation: "d(a,b) = distance between points a and b across two clusters. Linkage determines which inter-cluster distance to use."
    },
    steps: [
      { title: "Start: Each Point is a Cluster", description: "N data points = N clusters, each containing one point." },
      { title: "Find Closest Pair", description: "Compute distances between all cluster pairs. Find the two closest." },
      { title: "Merge", description: "Combine the two closest clusters into one. Now N-1 clusters remain." },
      { title: "Update Distances", description: "Recompute distances from the new cluster to all others using the linkage method." },
      { title: "Repeat Until One Cluster", description: "Continue merging until all points belong to a single cluster." },
      { title: "Cut Dendrogram", description: "Choose a cut level to get the desired number of clusters." }
    ],
    failures: {
      title: "Linkage Method Impact",
      leftLabel: "Single Linkage",
      rightLabel: "Complete Linkage",
      leftDescription: "Can create 'chaining' — elongated clusters connected by single close points.",
      rightDescription: "Produces more compact, spherical clusters but may split natural elongated groups."
    }
  },
  'precision-recall': {
    intuition: {
      analogy: "Precision is like a sniper (every shot hits the target) while Recall is like a shotgun (hits all targets but also non-targets). The PR curve shows this tradeoff.",
      bullets: [
        "Precision: of predicted positives, how many are correct?",
        "Recall: of actual positives, how many did we find?",
        "Useful for imbalanced datasets",
        "PR-AUC summarizes overall performance"
      ],
      formula: "Precision = TP/(TP+FP)   |   Recall = TP/(TP+FN)",
      formulaExplanation: "As threshold increases: precision generally increases (fewer false positives) but recall decreases (more false negatives)."
    },
    steps: [
      { title: "Get Probability Scores", description: "Model outputs probability for each sample." },
      { title: "Set Threshold", description: "Choose a cutoff — above = positive, below = negative." },
      { title: "Compute P & R", description: "At the threshold, calculate precision and recall." },
      { title: "Sweep Thresholds", description: "Vary threshold from 0 to 1, plotting precision vs recall at each point." },
      { title: "Analyze Curve", description: "A curve closer to the top-right corner indicates better performance." }
    ],
    failures: {
      title: "Precision-Recall Tradeoff",
      leftLabel: "High Precision, Low Recall",
      rightLabel: "High Recall, Low Precision",
      leftDescription: "Only predicts positive when very confident — misses many actual positives.",
      rightDescription: "Predicts almost everything as positive — catches all positives but many false alarms."
    }
  },
  'learning-curves': {
    intuition: {
      analogy: "Learning curves are like a student's exam scores over time — plotting how training and test performance change as the model sees more data or becomes more complex.",
      bullets: [
        "Training error decreases with more data/complexity",
        "Validation error has a U-shape with complexity",
        "Gap between curves indicates overfitting",
        "Converging curves suggest more data would help"
      ],
      formula: "Training Error ↓ as complexity ↑   |   Validation Error: U-shaped",
      formulaExplanation: "At optimal complexity: training and validation errors are both low and close together. Left of optimal = underfitting, right = overfitting."
    },
    steps: [
      { title: "Choose Model & Data", description: "Select a model type and generate training + validation data." },
      { title: "Vary Complexity", description: "Train models with increasing complexity (e.g., polynomial degree)." },
      { title: "Record Training Error", description: "At each complexity, measure error on training data." },
      { title: "Record Validation Error", description: "At each complexity, measure error on held-out validation data." },
      { title: "Plot Both Curves", description: "Training error decreases, validation error forms a U-shape. The sweet spot is where they're both low." }
    ],
    failures: {
      title: "Diagnosing Problems",
      leftLabel: "Underfitting (High Bias)",
      rightLabel: "Overfitting (High Variance)",
      leftDescription: "Both curves are high and close together. Model is too simple. More data won't help — need more complexity.",
      rightDescription: "Training error is low but validation error is high. Large gap = the model memorizes training data."
    }
  }
};
