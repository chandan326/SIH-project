from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger
from app.core.database import async_engine, Base
from app.api.v1.router import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} Backend Service...")
    logger.info(f"Tagline: {settings.TAGLINE}")
    logger.info(f"Disclaimer: {settings.DEMO_DISCLAIMER}")
    
    # Initialize DB Tables (for development / sqlite / postgis)
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME} Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.TAGLINE}\n\nIMPORTANT: {settings.DEMO_DISCLAIMER}",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for all local environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "title": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "disclaimer": settings.DEMO_DISCLAIMER,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
