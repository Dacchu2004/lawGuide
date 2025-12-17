import os
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from dotenv import load_dotenv

load_dotenv()

client = QdrantClient(
    url=os.environ["QDRANT_URL"],
    api_key=os.environ["QDRANT_API_KEY"],
)

COLLECTION = "legal_sections"

# 1️⃣ Count points
count = client.count(collection_name=COLLECTION, exact=True)
print("Total points:", count.count)

# 2️⃣ Sample search (no filters)
res = client.search(
    collection_name=COLLECTION,
    query_vector=[0.0] * 384,  # dummy vector
    limit=1,
)
print("Sample payload keys:", res[0].payload.keys())

# 3️⃣ Filter test (this previously failed)
res2 = client.search(
    collection_name=COLLECTION,
    query_vector=[0.0] * 384,
    limit=1,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="state",
                match=MatchValue(value="India"),
            )
        ]
    ),
)

print("Filtered search OK:", len(res2))
