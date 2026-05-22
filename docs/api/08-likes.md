# Likes API

_(Likes CRUD - User only)_

- [POST] /

---

**Note:** All endpoints mounted under _(/api/likes)_

---

## [POST] /api/likes/

Toggle like/unlike on a post

**Access:** User token required

**Headers:** accessToken: "<jwt_token>"

**Endpoint:** [POST] http://localhost:3002/api/likes/

**Request Body:**
raw JSON
{
"postId": 2
}

**Response (Liked):** 200 Ok
{
"liked": true
}

**Response (Unliked):** 200 Ok
{
"liked": false
}
