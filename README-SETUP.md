# BookmarkAI Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000)

## Demo Authentication

For testing, you can use these demo credentials:

**Login:**
- Email: `demo@bookmarkai.com`
- Password: `password`

**Or create a new account** using the Sign Up tab.

## Features Integrated

✅ **Authentication**: JWT-based login/register
✅ **Add Bookmarks**: Save bookmarks with vector embeddings
✅ **Edit Bookmarks**: Update existing bookmarks with new embeddings
✅ **Delete Bookmarks**: Remove bookmarks with confirmation
✅ **Semantic Search**: AI-powered search using Gemini embeddings
✅ **Real-time Search**: Debounced search with loading states
✅ **Error Handling**: Proper error messages and fallbacks

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `GET /api/bookmarks` - Fetch all bookmarks
- `POST /api/bookmarks` - Add new bookmark
- `PUT /api/bookmarks/[id]` - Update existing bookmark
- `DELETE /api/bookmarks/[id]` - Delete bookmark
- `POST /api/search` - Semantic search

## Database

Your bookmarks are stored in SingleStore with:
- Vector embeddings for semantic search
- Full-text search capabilities
- Proper indexing for performance

## Environment Variables

Make sure your `.env.local` contains:
- `DATABASE_URL` - SingleStore connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `JWT_SECRET` - JWT signing secret