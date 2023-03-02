# Chat

## Operations

### sendMessage

```http
POST /chat
```

Send a message

### getMessages

```http
GET /chat/{userid}
```

Get messages

## Implementation

This is an example of the API implementation to use to update the actual API implementation
when the API structure has changed.

```typescript
async function sendMessage(request: Api.Message): Promise<t.SendMessageResponse> {
	throw 'Unimplemented'
}

async function getMessages(userid: string): Promise<t.GetMessagesResponse> {
	throw 'Unimplemented'
}


const api: t.ChatApi = {
	sendMessage,
	getMessages,
}

export default api
```
