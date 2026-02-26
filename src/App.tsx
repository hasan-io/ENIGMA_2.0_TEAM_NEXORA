import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Simulations from "./pages/Simulations";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import LinearRegressionSim from "./pages/simulators/LinearRegressionSim";
import PolynomialRegressionSim from "./pages/simulators/PolynomialRegressionSim";
import LogisticRegressionSim from "./pages/simulators/LogisticRegressionSim";
import KNNSim from "./pages/simulators/KNNSim";
import KMeansSim from "./pages/simulators/KMeansSim";
import GradientDescentSim from "./pages/simulators/GradientDescentSim";
import FeatureScalingSim from "./pages/simulators/FeatureScalingSim";
import ConfusionMatrixSim from "./pages/simulators/ConfusionMatrixSim";
import ROCCurveSim from "./pages/simulators/ROCCurveSim";
import LassoRegressionSim from "./pages/simulators/LassoRegressionSim";
import RidgeRegressionSim from "./pages/simulators/RidgeRegressionSim";
import DecisionTreeSim from "./pages/simulators/DecisionTreeSim";
import HierarchicalClusteringSim from "./pages/simulators/HierarchicalClusteringSim";
import PrecisionRecallSim from "./pages/simulators/PrecisionRecallSim";
import LearningCurvesSim from "./pages/simulators/LearningCurvesSim";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/simulations/linear-regression" element={<LinearRegressionSim />} />
            <Route path="/simulations/polynomial-regression" element={<PolynomialRegressionSim />} />
            <Route path="/simulations/logistic-regression" element={<LogisticRegressionSim />} />
            <Route path="/simulations/knn" element={<KNNSim />} />
            <Route path="/simulations/kmeans" element={<KMeansSim />} />
            <Route path="/simulations/gradient-descent" element={<GradientDescentSim />} />
            <Route path="/simulations/feature-scaling" element={<FeatureScalingSim />} />
            <Route path="/simulations/confusion-matrix" element={<ConfusionMatrixSim />} />
            <Route path="/simulations/roc-curve" element={<ROCCurveSim />} />
            <Route path="/simulations/lasso-regression" element={<LassoRegressionSim />} />
            <Route path="/simulations/ridge-regression" element={<RidgeRegressionSim />} />
            <Route path="/simulations/decision-tree" element={<DecisionTreeSim />} />
            <Route path="/simulations/hierarchical-clustering" element={<HierarchicalClusteringSim />} />
            <Route path="/simulations/precision-recall" element={<PrecisionRecallSim />} />
            <Route path="/simulations/learning-curves" element={<LearningCurvesSim />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
