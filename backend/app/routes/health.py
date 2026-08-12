"""
@file health.py
@description

Health check routes.

This module defines endpoints used to verify that the backend service is alive
and functioning.

These routes are typically used by:
- Docker (container health checks)
- Load balancers
- Monitoring/uptime systems
"""

from fastapi import APIRouter


"""
@constant router
@type {APIRouter}
@description

APIRouter instance used to group related routes.

Why this exists:
- Keeps routes modular
- Allows separation by feature (health, auth, favourites, etc.)
- Makes the app scalable as it grows

This router is later "plugged into" the main FastAPI app.
"""
router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


"""
@route GET /health
@function health_check
@description

Health check endpoint.

Purpose:
- Confirms that the API server is running
- Provides a standardized endpoint for system checks

In the future, this can be extended to verify:
- Database connectivity
- External API availability

@returns {dict} Service health status
"""
@router.get("/")
def health_check():
    """
    @description
    Executed when a GET request is made to /health.

    Returns a simple JSON response indicating the service is operational.
    """
    return {
        "status": "ok"
    }