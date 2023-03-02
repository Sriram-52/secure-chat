# Authentication

## Operations

### loginUser

```http
POST /login
```

Login a user

### logoutUser

```http
POST /logout
```

Logout a user

### registerUser

```http
POST /register
```

Register a new user

## Implementation

This is an example of the API implementation to use to update the actual API implementation
when the API structure has changed.

```typescript
async function loginUser(request: Api.User): Promise<t.LoginUserResponse> {
	throw 'Unimplemented'
}

async function logoutUser(request: Api.User): Promise<t.LogoutUserResponse> {
	throw 'Unimplemented'
}

async function registerUser(request: Api.User): Promise<t.RegisterUserResponse> {
	throw 'Unimplemented'
}


const api: t.AuthenticationApi = {
	loginUser,
	logoutUser,
	registerUser,
}

export default api
```
