import { TrendingUp, Target, Layers, Gauge, BarChart3, Zap, Wrench } from 'lucide-react';

export interface SimulationTopic {
  id: string;
  title: string;
  description: string;
  domain: string;
  category: string;
  available: boolean;
  route: string;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  topics: SimulationTopic[];
}

export const domains: Domain[] = [
  {
    id: 'models',
    title: 'Models',
    description: 'Explore regression, classification, and clustering algorithms',
    icon: Layers,
    color: 'primary',
    topics: [
      { id: 'linear-regression', title: 'Linear Regression', description: 'Fit a line to data using least squares', domain: 'Models', category: 'Regression', available: true, route: '/simulations/linear-regression' },
      { id: 'polynomial-regression', title: 'Polynomial Regression', description: 'Fit polynomial curves to data', domain: 'Models', category: 'Regression', available: true, route: '/simulations/polynomial-regression' },
      { id: 'logistic-regression', title: 'Logistic Regression', description: 'Binary classification with sigmoid function', domain: 'Models', category: 'Classification', available: true, route: '/simulations/logistic-regression' },
      { id: 'knn', title: 'K-Nearest Neighbors', description: 'Classify points by nearest neighbor voting', domain: 'Models', category: 'Classification', available: true, route: '/simulations/knn' },
      { id: 'kmeans', title: 'K-Means Clustering', description: 'Partition data into K clusters', domain: 'Models', category: 'Clustering', available: true, route: '/simulations/kmeans' },
      { id: 'decision-tree', title: 'Decision Tree', description: 'Tree-based classification', domain: 'Models', category: 'Classification', available: false, route: '#' },
      { id: 'svm', title: 'Support Vector Machine', description: 'Maximum margin classifier', domain: 'Models', category: 'Classification', available: false, route: '#' },
      { id: 'naive-bayes', title: 'Naive Bayes', description: 'Probabilistic classification', domain: 'Models', category: 'Classification', available: false, route: '#' },
    ],
  },
  {
    id: 'evaluation',
    title: 'Model Evaluation',
    description: 'Understand how to measure model performance',
    icon: BarChart3,
    color: 'accent',
    topics: [
      { id: 'confusion-matrix', title: 'Confusion Matrix', description: 'Visualize classification accuracy', domain: 'Evaluation', category: 'Metrics', available: true, route: '/simulations/confusion-matrix' },
      { id: 'roc-curve', title: 'ROC Curve', description: 'Trade-off between TPR and FPR', domain: 'Evaluation', category: 'Metrics', available: true, route: '/simulations/roc-curve' },
      { id: 'cross-validation', title: 'Cross Validation', description: 'K-fold cross validation', domain: 'Evaluation', category: 'Techniques', available: false, route: '#' },
    ],
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Learn how models learn through optimization',
    icon: Zap,
    color: 'warning',
    topics: [
      { id: 'gradient-descent', title: 'Gradient Descent', description: '2D visualization of gradient descent', domain: 'Optimization', category: 'Algorithms', available: true, route: '/simulations/gradient-descent' },
      { id: 'sgd', title: 'Stochastic Gradient Descent', description: 'Mini-batch optimization', domain: 'Optimization', category: 'Algorithms', available: false, route: '#' },
    ],
  },
  {
    id: 'preprocessing',
    title: 'Data Preprocessing',
    description: 'Prepare your data for machine learning',
    icon: Wrench,
    color: 'success',
    topics: [
      { id: 'feature-scaling', title: 'Feature Scaling', description: 'Normalization vs Standardization', domain: 'Preprocessing', category: 'Scaling', available: true, route: '/simulations/feature-scaling' },
      { id: 'pca', title: 'PCA', description: 'Dimensionality reduction', domain: 'Preprocessing', category: 'Reduction', available: false, route: '#' },
    ],
  },
];

export function getAvailableTopicsForDomain(domainId: string) {
  const domain = domains.find(d => d.id === domainId);
  return domain?.topics.filter(t => t.available) ?? [];
}

export function getAllAvailableTopics() {
  return domains.flatMap(d => d.topics.filter(t => t.available));
}
