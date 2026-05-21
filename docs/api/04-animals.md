# Animals API

_(Animals CRUD - Public)_

- [GET] /byId/:id
- [GET] /byShelterId/:shelterId

_(Animals CRUD - Shelter Only)_

- [POST] /
- [GET] /mine
- [PUT] /:id
- [DELETE] /:id
- [GET] /stats

**TODO:**

- Add image upload for 'pictureUrl'
- Admin ability to delete any animal
- Add filtering to public endpoints

**Note:** All endpoints mounted under _('/api/animals')_

---

## [POST] /api/animals/

Creates a new animal

**Access:** Shelter token required

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** [POST] http://localhost:3002/api/animals/

**Request Body:**
raw JSON
{
"species": "Dog",
"name": "Buddy",
"age": 3,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "High",
"goodWithKids": true,
"goodWithPets": true,
"description": "Friendly and energetic dog",
"pictureUrl": "https://randomexample.com/buddy.jpg"
}

**Response** 201 Created
{
"id": 1,
"species": "Dog",
"name": "Buddy",
"age": 3,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "High",
"goodWithKids": true,
"goodWithPets": true,
"description": "Friendly and energetic dog",
"pictureUrl": "https://randomexample.com/buddy.jpg",
"shelterId": 2,
"updatedAt": "2026-05-21T14:00:54.971Z",
"createdAt": "2026-05-21T14:00:54.971Z"
}

---

## [GET] /api/animals/mine

Get all animals for the authenticated shelter

**Access:** Shelter token required

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** [GET] http://localhost:3002/api/animals/mine

**Response:** 200 OK
[
{
"id": 1,
"species": "Dog",
"name": "Buddy",
"age": 3,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "High",
"goodWithKids": true,
"goodWithPets": true,
"description": "Friendly and energetic dog",
"pictureUrl": "https://randomexample.com/buddy.jpg",
"shelterId": 2,
"createdAt": "2026-05-21T14:00:54.000Z",
"updatedAt": "2026-05-21T14:00:54.000Z",
"shelterStaffId": null
},
{
"id": 2,
"species": "Cat",
"name": "Biddy",
"age": 6,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "Low",
"goodWithKids": true,
"goodWithPets": false,
"description": "Independent but very friendly",
"pictureUrl": "https://randomexample2.com/biddy.jpg",
"shelterId": 2,
"createdAt": "2026-05-21T15:53:43.000Z",
"updatedAt": "2026-05-21T15:53:43.000Z",
"shelterStaffId": null
}
]

---

## [GET] /api/animals/byShelterId/:shelterId

Get all animals for a specific shelter _(Public)_

**Access:** Public

**Endpoint:** [GET] http://localhost:3002/api/animals/byShelterId/2

**Response:** 200 Ok
[
{
"id": 1,
"species": "Dog",
"name": "Buddy",
"age": 3,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "High",
"goodWithKids": true,
"goodWithPets": true,
"description": "Friendly and energetic dog",
"pictureUrl": "https://randomexample.com/buddy.jpg",
"shelterId": 2,
"createdAt": "2026-05-21T14:00:54.000Z",
"updatedAt": "2026-05-21T14:00:54.000Z",
"shelterStaffId": null
},
{
"id": 2,
"species": "Cat",
"name": "Biddy",
"age": 6,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "Low",
"goodWithKids": true,
"goodWithPets": false,
"description": "Independent but very friendly",
"pictureUrl": "https://randomexample2.com/biddy.jpg",
"shelterId": 2,
"createdAt": "2026-05-21T15:53:43.000Z",
"updatedAt": "2026-05-21T15:53:43.000Z",
"shelterStaffId": null
}
]

---

## [GET] /api/animals/stats

Get animal statistics for the authenticated shelter's dashboard

**Access:** Shelter token required

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** [GET] http://localhost:3002/api/animals/stats

**Response:** 200 Ok
{
"total": 6,
"dogs": 3,
"cats": 2,
"others": 1
}

---

## [GET] /api/animals/byId/:id

Get a single animal by ID _(Public)_

**Access:** Public

**Endpoint:** [GET] http://localhost:3002/api/animals/byId/3

**Response:** 200 ok
{
"id": 3,
"species": "Cat",
"name": "Biddy222222",
"age": 6,
"ageUnit": "Years",
"health": "Good",
"size": "Medium",
"activityLevel": "Low",
"goodWithKids": true,
"goodWithPets": false,
"description": "Independent but very friendly",
"pictureUrl": "https://randomexample2.com/biddy.jpg",
"shelterId": 4,
"createdAt": "2026-05-21T16:03:36.000Z",
"updatedAt": "2026-05-21T16:03:36.000Z",
"shelterStaffId": null
}

---

## [PUT] /api/animals/:id

Update an animal (Shelter only - must own the animal)

**Access:** Shelter token required

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** [PUT] http://localhost:3002/api/animals/3

**Request Body:** _(partial updates supported)_
raw JSON
{
"name": "baddy Updated",
"health": "Needs Medication",
"description": "Now needs daily medication"
}

**Response:** 200 Ok
{
"message": "Animal updated successfully",
"animal": {
"id": 3,
"species": "Cat",
"name": "baddy Updated",
"age": 6,
"ageUnit": "Years",
"health": "Needs Medication",
"size": "Medium",
"activityLevel": "Low",
"goodWithKids": true,
"goodWithPets": false,
"description": "Now needs daily medication",
"pictureUrl": "https://randomexample2.com/biddy.jpg",
"shelterId": 4,
"createdAt": "2026-05-21T16:03:36.000Z",
"updatedAt": "2026-05-21T16:17:19.016Z",
"shelterStaffId": null
}
}

---

## [DELETE] /api/animals/3

Delete an animal (Shelter only - must own the animal)

**Access:** Shelter token required

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint** [DELETE] http://localhost:3002/api/animals/3

**Response:** 200 Ok
{
"message": "Animal deleted successfully"
}
