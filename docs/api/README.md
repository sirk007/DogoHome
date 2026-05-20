# DogoHome API documentation

## BASE URL

[http://localhost:3002/api]

## Authentication Headers

**User:** accessToken: "<jwt_token>"
**Shelter:** accessShelterToken: "<jwt_token>"
**Admin:** adminAccessToken: "<jwt_token>"
**Super Admin:** superAdminAccessToken: "<jwt_token>"

## Standard Error Responses

[400] | Bad Request | Invaild Input
[401] | Unauthorized | No token provided or token expired
[403] | Forbidden | Valid token but insufficient permissions
[404] | Not Found | Resource does not exist
[409] | Conflict | Email/Username already exists
[500] | Internal Server Error | Something went wrong with server

## API Endpoints

- Users API
- Shelters API
- Admins API
- Super Admins API
