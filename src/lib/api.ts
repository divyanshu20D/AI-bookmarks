// API service functions for BookmarkAI

export interface ApiBookmark {
    id: number;
    url: string;
    title: string | null;
    content: string;
    createdAt: string;
    similarity?: number;
}

export interface FrontendBookmark {
    id: string;
    title: string;
    description: string;
    url: string;
    createdAt: string;
}

// Convert API bookmark to frontend format
export function convertApiBookmarkToFrontend(apiBookmark: ApiBookmark): FrontendBookmark {
    return {
        id: apiBookmark.id.toString(),
        title: apiBookmark.title || 'Untitled',
        description: apiBookmark.content,
        url: apiBookmark.url,
        createdAt: apiBookmark.createdAt,
    };
}

// Convert frontend bookmark to API format
export function convertFrontendBookmarkToApi(frontendBookmark: Omit<FrontendBookmark, 'id' | 'createdAt'>): { url: string; title: string; content: string } {
    return {
        url: frontendBookmark.url,
        title: frontendBookmark.title,
        content: frontendBookmark.description,
    };
}

// Get auth token from localStorage
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('bookmarkAI_token');
}

// API request helper with auth
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Auth API functions
export async function loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function registerUser(email: string, password: string): Promise<{ token: string; user: any }> {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

// Bookmark API functions
export async function fetchBookmarks(): Promise<FrontendBookmark[]> {
    const apiBookmarks: ApiBookmark[] = await apiRequest('/bookmarks');
    return apiBookmarks.map(convertApiBookmarkToFrontend);
}

export async function addBookmark(bookmark: Omit<FrontendBookmark, 'id' | 'createdAt'>): Promise<void> {
    const apiBookmark = convertFrontendBookmarkToApi(bookmark);
    await apiRequest('/bookmarks', {
        method: 'POST',
        body: JSON.stringify(apiBookmark),
    });
}

export async function searchBookmarks(query: string): Promise<FrontendBookmark[]> {
    const apiBookmarks: ApiBookmark[] = await apiRequest('/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
    });
    return apiBookmarks.map(convertApiBookmarkToFrontend);
}

export async function updateBookmark(id: string, bookmark: Omit<FrontendBookmark, 'id' | 'createdAt'>): Promise<void> {
    const apiBookmark = convertFrontendBookmarkToApi(bookmark);
    await apiRequest(`/bookmarks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiBookmark),
    });
}

export async function deleteBookmark(id: string): Promise<void> {
    await apiRequest(`/bookmarks/${id}`, {
        method: 'DELETE',
    });
}