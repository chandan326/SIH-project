from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import RandomForestClassifier


class AnomalyMLModel:
    """
    Explainable Machine Learning Anomaly Classifier.
    Predicts anomaly probability and extracts feature importances.
    NOTE: Trained on synthetic feature matrices; does not perform legal title decisions.
    """

    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=2026)
        self._train_synthetic_baseline()

    def _train_synthetic_baseline(self):
        # Features: [area_diff_pct, missing_reg, missing_ror, dispute_count, enc_count, pending_mut, invalid_geom]
        X_train = np.array([
            [0.5, 0, 0, 0, 0, 0, 0],  # Normal healthy
            [1.2, 0, 0, 0, 0, 0, 0],  # Normal healthy
            [12.5, 0, 0, 0, 0, 0, 0], # Area Mismatch (Anomaly)
            [0.2, 1, 0, 0, 0, 0, 0],  # Missing Registration (Anomaly)
            [0.5, 0, 1, 0, 0, 0, 0],  # Missing RoR (Anomaly)
            [0.0, 0, 0, 1, 0, 0, 0],  # Active Dispute (Anomaly)
            [0.0, 0, 0, 0, 1, 0, 0],  # Active Encumbrance (Anomaly)
            [0.0, 0, 0, 0, 0, 1, 0],  # Pending Mutation (Anomaly)
            [0.0, 0, 0, 0, 0, 0, 1],  # Invalid Geometry (Anomaly)
        ])
        y_train = np.array([0, 0, 1, 1, 1, 1, 1, 1, 1])
        self.model.fit(X_train, y_train)

    def predict_anomaly(
        self,
        area_diff_pct: float,
        missing_reg: bool,
        missing_ror: bool,
        dispute_count: int,
        encumbrance_count: int,
        pending_mutation: bool,
        invalid_geometry: bool,
    ) -> Dict[str, Any]:
        feature_vector = np.array([[
            float(area_diff_pct),
            1.0 if missing_reg else 0.0,
            1.0 if missing_ror else 0.0,
            float(dispute_count),
            float(encumbrance_count),
            1.0 if pending_mutation else 0.0,
            1.0 if invalid_geometry else 0.0,
        ]])

        probs = self.model.predict_proba(feature_vector)[0]
        anomaly_prob = round(float(probs[1]), 3)

        feature_names = [
            "area_difference_percent",
            "missing_registration",
            "missing_ror",
            "dispute_count",
            "encumbrance_count",
            "pending_mutation",
            "invalid_geometry",
        ]
        importances = self.model.feature_importances_
        feature_importance_dict = {
            name: round(float(imp), 4) for name, imp in zip(feature_names, importances)
        }

        return {
            "anomaly_probability": anomaly_prob,
            "is_anomalous_flag": bool(anomaly_prob > 0.5),
            "feature_importances": feature_importance_dict,
            "disclaimer": "ML prediction is for synthetic data quality triage only and does not establish legal status.",
        }


ml_anomaly_detector = AnomalyMLModel()
