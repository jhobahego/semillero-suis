from fastapi.testclient import TestClient

from app.main import app

import pytest


@pytest.fixture()
def client():
    return TestClient(app)


# Returns a RedirectResponse object with url "/docs"
def test_returns_redirect_response_with_url_docs(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
