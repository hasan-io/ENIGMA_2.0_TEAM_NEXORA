export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TopicQuiz {
  topicId: string;
  topicName: string;
  domainName: string;
  questions: QuizQuestion[];
}

export const quizzes: TopicQuiz[] = [
  {
    topicId: 'linear-regression',
    topicName: 'Linear Regression',
    domainName: 'Models',
    questions: [
      { question: 'What does MSE stand for?', options: ['Mean Squared Error', 'Maximum Standard Error', 'Minimum Squared Estimate', 'Mean Standard Estimation'], correctIndex: 0 },
      { question: 'In y = mx + b, what does m represent?', options: ['Intercept', 'Slope', 'Mean', 'Margin'], correctIndex: 1 },
      { question: 'Which method finds the optimal line in linear regression?', options: ['Gradient Boosting', 'Least Squares', 'Random Forest', 'K-Means'], correctIndex: 1 },
      { question: 'What type of relationship does linear regression model?', options: ['Exponential', 'Logarithmic', 'Linear', 'Polynomial'], correctIndex: 2 },
      { question: 'If MSE = 0, what does it mean?', options: ['Model is overfit', 'Perfect predictions', 'No data points', 'Underfitting'], correctIndex: 1 },
      { question: 'What is the formula for the slope in least squares?', options: ['mean(y)/mean(x)', 'cov(x,y)/var(x)', 'var(x)/cov(x,y)', 'std(y)/std(x)'], correctIndex: 1 },
      { question: 'Linear regression is a type of:', options: ['Unsupervised learning', 'Reinforcement learning', 'Supervised learning', 'Semi-supervised learning'], correctIndex: 2 },
      { question: 'What does the intercept b represent?', options: ['Slope at origin', 'Value of y when x=0', 'Maximum y value', 'Minimum x value'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'polynomial-regression',
    topicName: 'Polynomial Regression',
    domainName: 'Models',
    questions: [
      { question: 'Polynomial regression of degree 1 is equivalent to:', options: ['Logistic regression', 'Linear regression', 'K-Means', 'KNN'], correctIndex: 1 },
      { question: 'Higher degree polynomials increase risk of:', options: ['Underfitting', 'Overfitting', 'Bias', 'Simplicity'], correctIndex: 1 },
      { question: 'What does degree mean in polynomial regression?', options: ['Number of features', 'Highest power of x', 'Number of data points', 'Learning rate'], correctIndex: 1 },
      { question: 'The normal equation is used to:', options: ['Classify data', 'Find optimal coefficients', 'Normalize data', 'Calculate distance'], correctIndex: 1 },
      { question: 'A degree-2 polynomial produces what shape?', options: ['Line', 'Parabola', 'Circle', 'Sine wave'], correctIndex: 1 },
      { question: 'Increasing polynomial degree always improves test accuracy.', options: ['True', 'False', 'Sometimes', 'Only for large datasets'], correctIndex: 1 },
      { question: 'Which is NOT a risk of high-degree polynomials?', options: ['Overfitting', 'Oscillation', 'Underfitting', 'High variance'], correctIndex: 2 },
      { question: 'Polynomial regression is still considered:', options: ['Non-linear in parameters', 'Linear in parameters', 'Unsupervised', 'Non-parametric'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'logistic-regression',
    topicName: 'Logistic Regression',
    domainName: 'Models',
    questions: [
      { question: 'Logistic regression is used for:', options: ['Regression', 'Classification', 'Clustering', 'Dimensionality reduction'], correctIndex: 1 },
      { question: 'The sigmoid function outputs values between:', options: ['0 and 1', '-1 and 1', '0 and infinity', '-infinity and infinity'], correctIndex: 0 },
      { question: 'The decision boundary is where:', options: ['p = 1', 'p = 0', 'p = 0.5', 'p = -1'], correctIndex: 2 },
      { question: 'Sigmoid formula is:', options: ['1/(1+e^x)', '1/(1+e^-x)', 'e^x/(1+e^x)', 'tanh(x)'], correctIndex: 1 },
      { question: 'In wx + b = 0, what is b?', options: ['Weight', 'Bias', 'Slope', 'Feature'], correctIndex: 1 },
      { question: 'Logistic regression predicts:', options: ['Continuous values', 'Probabilities', 'Distances', 'Clusters'], correctIndex: 1 },
      { question: 'If sigmoid output is 0.8, the predicted class is:', options: ['Class 0', 'Class 1', 'Uncertain', 'Both'], correctIndex: 1 },
      { question: 'Logistic regression uses which loss function?', options: ['MSE', 'Cross-entropy', 'Hinge loss', 'MAE'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'knn',
    topicName: 'K-Nearest Neighbors',
    domainName: 'Models',
    questions: [
      { question: 'KNN is a type of:', options: ['Parametric model', 'Non-parametric model', 'Generative model', 'Linear model'], correctIndex: 1 },
      { question: 'What distance metric is commonly used in KNN?', options: ['Manhattan', 'Euclidean', 'Cosine', 'All of the above'], correctIndex: 3 },
      { question: 'Increasing K generally makes the model:', options: ['More complex', 'Smoother', 'Faster', 'More accurate'], correctIndex: 1 },
      { question: 'KNN with K=1 is prone to:', options: ['Underfitting', 'Overfitting', 'Bias', 'Stability'], correctIndex: 1 },
      { question: 'KNN classifies based on:', options: ['Decision boundary', 'Majority vote', 'Probability', 'Gradient'], correctIndex: 1 },
      { question: 'KNN requires:', options: ['Training phase', 'No training phase', 'Backpropagation', 'Loss function'], correctIndex: 1 },
      { question: 'What happens when K equals the dataset size?', options: ['Perfect accuracy', 'Always predicts majority class', 'Random predictions', 'Error'], correctIndex: 1 },
      { question: 'KNN time complexity at prediction is:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2 },
    ],
  },
  {
    topicId: 'kmeans',
    topicName: 'K-Means Clustering',
    domainName: 'Models',
    questions: [
      { question: 'K-Means is a type of:', options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Semi-supervised'], correctIndex: 1 },
      { question: 'What does K represent in K-Means?', options: ['Number of features', 'Number of clusters', 'Number of iterations', 'Number of data points'], correctIndex: 1 },
      { question: 'K-Means converges when:', options: ['K iterations complete', 'Centroids stop moving', 'All points are assigned', 'Error is zero'], correctIndex: 1 },
      { question: 'Centroids are recalculated as:', options: ['Median of cluster', 'Mean of cluster', 'Mode of cluster', 'Max of cluster'], correctIndex: 1 },
      { question: 'K-Means is sensitive to:', options: ['Feature scaling', 'Initial centroids', 'Both A and B', 'Neither'], correctIndex: 2 },
      { question: 'Points are assigned to clusters by:', options: ['Random assignment', 'Nearest centroid', 'Farthest centroid', 'Alphabetical order'], correctIndex: 1 },
      { question: 'K-Means guarantees finding the global optimum.', options: ['True', 'False'], correctIndex: 1 },
      { question: 'The elbow method helps determine:', options: ['Learning rate', 'Optimal K', 'Convergence', 'Accuracy'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'confusion-matrix',
    topicName: 'Confusion Matrix',
    domainName: 'Evaluation',
    questions: [
      { question: 'A confusion matrix is used for:', options: ['Regression', 'Classification evaluation', 'Clustering', 'Feature selection'], correctIndex: 1 },
      { question: 'True Positive means:', options: ['Predicted positive, actually negative', 'Predicted positive, actually positive', 'Predicted negative, actually positive', 'Predicted negative, actually negative'], correctIndex: 1 },
      { question: 'Precision is calculated as:', options: ['TP/(TP+FN)', 'TP/(TP+FP)', 'TN/(TN+FP)', 'TP/(TP+TN)'], correctIndex: 1 },
      { question: 'Recall is also known as:', options: ['Precision', 'Specificity', 'Sensitivity', 'Accuracy'], correctIndex: 2 },
      { question: 'F1 Score is the:', options: ['Average of precision and recall', 'Harmonic mean of precision and recall', 'Product of precision and recall', 'Max of precision and recall'], correctIndex: 1 },
      { question: 'Accuracy is calculated as:', options: ['(TP+TN)/Total', 'TP/Total', 'TN/Total', '(TP+FP)/Total'], correctIndex: 0 },
      { question: 'A False Negative is a:', options: ['Type I error', 'Type II error', 'Correct prediction', 'True positive'], correctIndex: 1 },
      { question: 'High recall means:', options: ['Few false positives', 'Few false negatives', 'High accuracy', 'Low precision'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'roc-curve',
    topicName: 'ROC Curve',
    domainName: 'Evaluation',
    questions: [
      { question: 'ROC stands for:', options: ['Rate of Classification', 'Receiver Operating Characteristic', 'Random Operating Curve', 'Ratio of Correct'], correctIndex: 1 },
      { question: 'ROC curve plots:', options: ['Precision vs Recall', 'TPR vs FPR', 'Accuracy vs Loss', 'TP vs TN'], correctIndex: 1 },
      { question: 'AUC of 1.0 means:', options: ['Random classifier', 'Perfect classifier', 'Worst classifier', 'Undefined'], correctIndex: 1 },
      { question: 'AUC of 0.5 means:', options: ['Perfect classifier', 'Random classifier', 'Worst classifier', 'Good classifier'], correctIndex: 1 },
      { question: 'TPR is the same as:', options: ['Precision', 'Recall', 'Specificity', 'Accuracy'], correctIndex: 1 },
      { question: 'FPR is calculated as:', options: ['FP/(FP+TN)', 'FP/(FP+TP)', 'TN/(TN+FP)', 'TP/(TP+FN)'], correctIndex: 0 },
      { question: 'A good ROC curve is closest to:', options: ['Bottom-right', 'Top-left', 'Center', 'Top-right'], correctIndex: 1 },
      { question: 'ROC curves are useful for:', options: ['Regression', 'Binary classification', 'Clustering', 'Dimensionality reduction'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'gradient-descent',
    topicName: 'Gradient Descent',
    domainName: 'Optimization',
    questions: [
      { question: 'Gradient descent minimizes:', options: ['Features', 'Loss function', 'Data points', 'Learning rate'], correctIndex: 1 },
      { question: 'The learning rate controls:', options: ['Number of features', 'Step size', 'Number of iterations', 'Data size'], correctIndex: 1 },
      { question: 'Too high learning rate causes:', options: ['Slow convergence', 'Divergence', 'Perfect convergence', 'Underfitting'], correctIndex: 1 },
      { question: 'Too low learning rate causes:', options: ['Fast convergence', 'Divergence', 'Slow convergence', 'Overfitting'], correctIndex: 2 },
      { question: 'The gradient points in the direction of:', options: ['Steepest descent', 'Steepest ascent', 'Minimum', 'Zero'], correctIndex: 1 },
      { question: 'Update rule: w = w - lr * gradient. What is lr?', options: ['Loss rate', 'Learning rate', 'Linear rate', 'Log rate'], correctIndex: 1 },
      { question: 'For f(w) = w², the derivative is:', options: ['w', '2w', 'w²', '2'], correctIndex: 1 },
      { question: 'Gradient descent converges when:', options: ['Gradient is large', 'Gradient approaches zero', 'Learning rate is 1', 'Iterations end'], correctIndex: 1 },
    ],
  },
  {
    topicId: 'feature-scaling',
    topicName: 'Feature Scaling',
    domainName: 'Preprocessing',
    questions: [
      { question: 'Normalization scales data to:', options: ['Mean 0, Std 1', '0 to 1', '-1 to 1', '0 to 100'], correctIndex: 1 },
      { question: 'Standardization results in:', options: ['Range 0-1', 'Mean 0, Std 1', 'Range -1 to 1', 'Max = 1'], correctIndex: 1 },
      { question: 'Normalization formula is:', options: ['(x-mean)/std', '(x-min)/(max-min)', 'x/max', 'x/sum'], correctIndex: 1 },
      { question: 'Standardization formula is:', options: ['(x-min)/(max-min)', '(x-mean)/std', 'x/max', 'log(x)'], correctIndex: 1 },
      { question: 'Feature scaling is important for:', options: ['Decision trees', 'Distance-based algorithms', 'Random forests', 'Naive Bayes'], correctIndex: 1 },
      { question: 'Which is more affected by outliers?', options: ['Normalization', 'Standardization', 'Both equally', 'Neither'], correctIndex: 0 },
      { question: 'When should you use standardization?', options: ['Data is uniformly distributed', 'Data is normally distributed', 'Data has no pattern', 'Always'], correctIndex: 1 },
      { question: 'Feature scaling is a form of:', options: ['Feature selection', 'Data preprocessing', 'Model evaluation', 'Hyperparameter tuning'], correctIndex: 1 },
    ],
  },
];

export function getQuizByTopicId(topicId: string) {
  return quizzes.find(q => q.topicId === topicId);
}
