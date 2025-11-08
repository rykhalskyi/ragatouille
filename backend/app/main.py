from fastapi import FastAPI
from app.routers import items, poc
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poc.router)
app.include_router(items.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
