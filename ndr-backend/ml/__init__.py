"""
Machine Learning inference engines for NDR Platform.
Includes Tabular DNN for packet/flow metric classification and
E-GraphSAGE GNN for topological lateral movement & anomaly detection.
"""
from .tabular_dnn import TabularDNNClassifier, get_tabular_dnn
from .graph_sage import EGraphSAGENetwork, get_graph_sage

__all__ = ["TabularDNNClassifier", "get_tabular_dnn", "EGraphSAGENetwork", "get_graph_sage"]
