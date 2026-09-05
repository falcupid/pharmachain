from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

import psycopg
from psycopg import Connection

from src.config import Config


@contextmanager
def get_db_connection() -> Iterator[Connection]:
    if not Config.DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is not configured. "
            "Add your Supabase Session Pooler connection string to the environment."
        )

    connection = psycopg.connect(Config.DATABASE_URL)

    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()