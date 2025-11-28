# API Testing Tool

A complete frontend API testing application similar to Postman/Hoppscotch built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Authentication System
- User registration and login
- JWT-like authentication using localStorage
- Session persistence
- User-specific data isolation

### ✅ API Request Builder
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **URL Input**: Full URL support with query parameter auto-append
- **Query Parameters**: Dynamic key-value pairs with enable/disable toggle
- **Headers**: Custom headers with enable/disable toggle
- **Body**: JSON editor with validation (for POST, PUT, PATCH)
- **Method Color Coding**: Visual differentiation for each HTTP method

### ✅ Response Viewer
- **Status Display**: HTTP status code and status text with color coding
- **Response Time**: Milliseconds tracking
- **Response Headers**: Key-value display
- **Response Body**: 
  - Pretty JSON formatting
  - Raw view mode
  - Copy to clipboard
  - Auto-detect content type

### ✅ History System
- Automatic saving of all API requests
- Display request method, URL, status, and response time
- Timestamp with relative time ("5m ago", "2h ago", etc.)
- Click to reload request into builder
- Clear history option
- User-specific history (linked to logged-in user)

### ✅ Collections System
- Create named collections (e.g., "User APIs", "Auth APIs")
- Save current request to any collection
- Name each saved request
- Edit request names
- Delete requests from collections
- Delete entire collections
- Load request from collection into builder
- Expandable/collapsible collection view
- Item count display

### ✅ UI/UX Features
- **Dark/Light Mode**: Toggle with persistent preference
- **Responsive Design**: Clean, modern interface
- **Color-Coded Methods**: Visual differentiation
- **Loading States**: Spinners during requests
- **Validation**: JSON body validation with real-time feedback
- **Sidebar Toggle**: Collapsible history/collections sidebar
- **Tab System**: Organized params, headers, and body
- **Badge Counts**: Visual indicators for active params and headers

## 🎨 Design

The application features a clean, Postman-like interface with:
- Orange accent color (#F97316)
- Professional gray scale for light/dark modes
- Smooth transitions and hover effects
- Intuitive icon usage from Lucide React
- Split-screen layout for request/response

## 🗂️ Project Structure

```
/
├── App.tsx                          # Main application entry
├── contexts/
│   ├── AuthContext.tsx              # Authentication state management
│   └── DataContext.tsx              # History & collections state
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx            # Login interface
│   │   └── RegisterPage.tsx         # Registration interface
│   └── workspace/
│       ├── Workspace.tsx            # Main workspace layout
│       ├── Header.tsx               # Top navigation bar
│       ├── Sidebar.tsx              # Left sidebar with tabs
│       ├── HistoryTab.tsx           # History list view
│       ├── CollectionsTab.tsx       # Collections management
│       ├── RequestBuilder.tsx       # API request builder
│       └── ResponseViewer.tsx       # API response display
└── README.md                        # This file
```

## 💾 Data Storage

All data is stored in browser **localStorage**:

- **Users**: `api_tool_users` (array of user objects)
- **Current Session**: `api_tool_user` (logged-in user)
- **History**: `api_tool_history_{userId}` (per-user request history)
- **Collections**: `api_tool_collections_{userId}` (per-user collections)
- **Dark Mode**: `darkMode` (preference)

## 🔐 Security Note

This is a **frontend-only demo application**:
- Passwords are Base64 encoded (NOT secure for production)
- All data is stored in browser localStorage
- No real backend authentication
- For production use, implement proper backend with:
  - Bcrypt password hashing
  - JWT tokens
  - Database (MongoDB/PostgreSQL)
  - HTTPS

## 🧪 Testing the Application

### Try these sample APIs:

1. **JSONPlaceholder** (Free fake API):
   ```
   GET https://jsonplaceholder.typicode.com/users
   GET https://jsonplaceholder.typicode.com/posts/1
   POST https://jsonplaceholder.typicode.com/posts
   Body: {"title": "Test", "body": "Content", "userId": 1}
   ```

2. **Dog API**:
   ```
   GET https://dog.ceo/api/breeds/image/random
   ```

3. **Cat Facts**:
   ```
   GET https://catfact.ninja/fact
   ```

### Workflow Example:

1. **Register** a new account (or login)
2. **Enter API URL**: `https://jsonplaceholder.typicode.com/users`
3. **Select Method**: GET
4. **Add Header** (optional): `Accept: application/json`
5. **Click Send**
6. **View Response** in the bottom panel
7. **Create Collection**: "Test APIs"
8. **Save Request** to the collection with name "Get All Users"
9. **View History** to see your request logged
10. **Toggle Dark Mode** for different viewing experience

## 🎯 Key Features Breakdown

### Request Builder
- Dynamic parameter rows (add/remove/toggle)
- Dynamic header rows (add/remove/toggle)
- JSON body validation
- Auto-build URL with query params
- Method-specific features (body only for POST/PUT/PATCH)

### Response Viewer
- Status color coding (green for 2xx, red for 4xx/5xx)
- Response time tracking
- Pretty/Raw view toggle
- Copy response to clipboard
- Headers inspection

### Collections
- Nested structure (collections → items)
- CRUD operations on collections and items
- Quick save from current request
- Load saved request with one click
- Inline edit for item names

### History
- Automatic saving on each request
- Most recent first
- Relative timestamps
- Status and response time display
- One-click reload

## 🌈 Customization

### Change Theme Colors
Edit the color values in components:
- Primary: `orange-500` (#F97316)
- Success: `green-500`
- Error: `red-500`
- Info: `blue-500`

### Add More HTTP Methods
Edit `HTTP_METHODS` array in `RequestBuilder.tsx`:
```typescript
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
```

## 🐛 Known Limitations

- **CORS**: Some APIs may block browser requests (use CORS-enabled APIs for testing)
- **File Upload**: Not supported (only JSON body)
- **Authentication**: Demo-level only (not production-ready)
- **Export**: Collections can't be exported (can be added)
- **Search**: No search in history or collections (can be added)

## 🚀 Future Enhancements

Possible additions:
- Environment variables support
- Code snippet generator (cURL, Fetch, Axios)
- Import/Export collections (JSON)
- Workspace tabs (multiple requests)
- GraphQL support
- WebSocket testing
- Request chaining
- Mock server
- Team collaboration

## 📝 License

This is a demo project for educational purposes.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
