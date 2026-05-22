# Counties API

_(Counties CRUD - Public)_

- [GET] /

---

**Note:** All endpoints mounted under _(/api/counties)_

- Counties are -Read Only- through API (seeding `npm run seed:counties`)
- No create/update/delete endpoints exposed (admin only via database)
- Used for user profiles, shelter locations and filtering

---

## [GET] /api/counties/

Get a list of all counties (Used for location filtering)

**Access:** Public

**Endpoint:** [GET] http://localhost:3002/api/counties/

**Response:** 200 Ok
[
{
"id": 1,
"countyName": "Carlow"
},
{
"id": 2,
"countyName": "Cavan"
},
{
"id": 3,
"countyName": "Clare"
},
{
"id": 4,
"countyName": "Cork"
},
{
"id": 5,
"countyName": "Donegal"
},
{
"id": 6,
"countyName": "Dublin"
},
{
"id": 7,
"countyName": "Galway"
},
{
"id": 8,
"countyName": "Kerry"
},
{
"id": 9,
"countyName": "Kildare"
},
{
"id": 10,
"countyName": "Kilkenny"
},
{
"id": 11,
"countyName": "Laois"
},
{
"id": 12,
"countyName": "Leitrim"
},
{
"id": 13,
"countyName": "Limerick"
},
{
"id": 14,
"countyName": "Longford"
},
{
"id": 15,
"countyName": "Louth"
},
{
"id": 16,
"countyName": "Mayo"
},
{
"id": 17,
"countyName": "Meath"
},
{
"id": 18,
"countyName": "Monaghan"
},
{
"id": 19,
"countyName": "Offaly"
},
{
"id": 20,
"countyName": "Roscommon"
},
{
"id": 21,
"countyName": "Sligo"
},
{
"id": 22,
"countyName": "Tipperary"
},
{
"id": 23,
"countyName": "Waterford"
},
{
"id": 24,
"countyName": "Westmeath"
},
{
"id": 25,
"countyName": "Wexford"
},
{
"id": 26,
"countyName": "Wicklow"
}
]
