from typing import Optional
from fastembed import TextEmbedding

_embedder: Optional[TextEmbedding] = None

def get_embedder() -> TextEmbedding:
    """
    Returns a singleton instance of the TextEmbedding model.
    Initializes the model on the first call.
    """
    global _embedder
    if _embedder is None:
        # The model is loaded on the first call.
        # This might introduce a small delay for the first user request
        # that needs embeddings, but avoids loading it at server startup
        # if it's not immediately needed.
        # Fastembed models are generally thread-safe for inference.
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        _embedder = TextEmbedding(model_name, cache_dir='.fastembed')
    return _embedder
