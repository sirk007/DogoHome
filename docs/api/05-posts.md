# Posts API

_(Posts CRUD - User Only)_

- [POST] /
- [GET] /
- [PUT] /:id
- [DELETE] /:id

_(Posts CRUD - Public)_

- [GET] /ById/:id
- [GET] /byUserId/:id

---

**TODO:**

- Add image upload for 'picture' field
- Add geo-spatial queries for map view (find posts near location)

**Note:** All endpoints mounted under _('/api/posts')_

**Post Types:** `LOST`, `FOUND`, `SIGHTING`

---

## [POST] /api/posts/

Creates a new post (lost/found/sighting)

**Access:** User token required

**Headers:** accessToken: "<jwt_token>"

**Endpoint:** [POST] http://localhost:3002/api/posts/

**Request Body:**
raw JSON
{
"title": "Lost Golden Retriever",
"postText": "Missing since yesterday near Central Park.",
"picture": null,
"type": "LOST",
"latitude": 53.369853,
"longitude": -6.407395
}

**Response:** 201 Created
{
"id": 1,
"title": "Lost Golden Retriever",
"postText": "Missing since yesterday near Central Park.",
"picture": null,
"userId": 5,
"type": "LOST",
"latitude": 53.369853,
"longitude": -6.407395,
"updatedAt": "2026-05-21T16:58:16.544Z",
"createdAt": "2026-05-21T16:58:16.544Z"
}

---

## [GET] /api/posts/

Get all posts (with like status for authenticated user).

**Access:** User token required

**Headers:** accessToken: "<jwt_token>"

**Query Parameters (optional):**

- Can retrieve all posts without filters
- type / Filter by post type (`LOST`, `FOUND`, `SIGHTING`)

**Endpoint:** [GET] http://localhost:3002/api/posts/?type=LOST

**Response:** 200 OK
{
"listOfPosts": [
{
"id": 1,
"title": "Lost Golden Retriever",
"postText": "Missing since yesterday near Central Park.",
"userId": 5,
"picture": null,
"type": "LOST",
"latitude": 53.3699,
"longitude": -6.40739,
"createdAt": "2026-05-21T16:58:16.000Z",
"updatedAt": "2026-05-21T16:58:16.000Z",
"shelterId": null,
"shelterStaffId": null,
"adminId": null,
"Likes": []
}
],
"likedPosts": []
}

---

## [GET] /api/posts/ById/:id

Get a single post by ID

**Access:** Public

**Endpoint:** [GET] http://localhost:3002/api/posts/ById/2

**Response:** 200 Ok
{
"id": 2,
"title": "SIGHTING Golden Retriever",
"postText": "Found today near Central Park.",
"userId": 5,
"picture": null,
"type": "SIGHTING",
"latitude": 53.3699,
"longitude": -6.40739,
"createdAt": "2026-05-21T17:36:10.000Z",
"updatedAt": "2026-05-21T17:36:10.000Z",
"shelterId": null,
"shelterStaffId": null,
"adminId": null,
"Likes": []
}

---

## [GET] /api/posts/byUserId/:id

Get all posts by a specific user

**Access:** Public

**Endpoint** [GET] http://localhost:3002/api/posts/byUserId/5

**Response:** 200 Ok
[
{
"id": 1,
"title": "Lost Golden Retriever",
"postText": "Missing since yesterday near Central Park.",
"userId": 5,
"picture": null,
"type": "LOST",
"latitude": 53.3699,
"longitude": -6.40739,
"createdAt": "2026-05-21T16:58:16.000Z",
"updatedAt": "2026-05-21T16:58:16.000Z",
"shelterId": null,
"shelterStaffId": null,
"adminId": null,
"Likes": []
},
{
"id": 2,
"title": "SIGHTING Golden Retriever",
"postText": "Missing since yesterday near Central Park.",
"userId": 5,
"picture": null,
"type": "SIGHTING",
"latitude": 53.3699,
"longitude": -6.40739,
"createdAt": "2026-05-21T17:36:10.000Z",
"updatedAt": "2026-05-21T17:36:10.000Z",
"shelterId": null,
"shelterStaffId": null,
"adminId": null,
"Likes": []
}
]

---

## [PUT] /api/posts/:id

Update a post (Owner or Admin Only)

**Access:** User token required (must be post owner or Admin)

**Headers:** `accessToken` || `adminAccessToken` : "<jwt_token>"

**Endpoint:** [PUT] http://localhost:3002/api/posts/2

**Request Body:** (Partial updates supported)
raw JSON
{
"title": "Updated Found",
"postText": "Updated Body",
"type": "FOUND"
}
**Response:** 200 Ok
{
"id": 1,
"title": "Updated Found",
"postText": "Updated Body",
"userId": 5,
"picture": null,
"type": "FOUND",
"latitude": 53.3699,
"longitude": -6.40739,
"createdAt": "2026-05-21T16:58:16.000Z",
"updatedAt": "2026-05-21T18:27:43.537Z",
"shelterId": null,
"shelterStaffId": null,
"adminId": null
}

---

## [DELETE] /api/posts/:id

Delete a post (Owner or Admin Only)

**Access:** User token required (must be post owner or Admin)

**Headers:** `accessToken` || `adminAccessToken` : "<jwt_token>"

**Endpoint:** [DELETE] http://localhost:3002/api/posts/1

**Response:** 200 Ok
{
"message": "Post deleted successfully"
}
