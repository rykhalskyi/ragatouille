from fastapi import APIRouter

router = APIRouter()

@router.get("/poc/")
def run_proof_of_concept():
    return {"mode": "Proof of concept"}
