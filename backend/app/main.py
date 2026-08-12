# Application entry point for the FastAPI backend.

# Responsibilities:
# - Create the FastAPI app instance
# - Register (mount) all route modules
# - Act as the central wiring point of the backend

# Mental model:
# This is the "app.js" / "server.js" of the backend.
# It does NOT contain business logic — only configuration and routing setup.
#

from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router


# Main application instance.

# FastAPI uses this object to:
# - Handle incoming HTTP requests
# - Register routes via routers
# - Generate API documentation (/docs)

# Everything in the backend is attached to this object.

app = FastAPI()



# Registers external route modules with the main app.

# - health_router comes from routes/health.py
# - All endpoints defined in that file become active here

# This keeps main.py clean and modular.

app.include_router(health_router)

# - auth_router comes from routes/auth.py
# - All endpoints defined in that file become active here

app.include_router(auth_router)



# Basic root endpoint.

# Purpose:
# - Quick manual test in browser
# - Confirms server is running

# Not critical for production — mainly for developer convenience.

# returns {dict} Simple status message

#@app.get("/")
#def root():
#    return {"message": "Backend is running"}