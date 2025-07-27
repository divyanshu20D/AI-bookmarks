"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookmarkIcon, SearchIcon, PlusIcon, LogOutIcon } from "lucide-react";
import { BookmarkCard } from "./BookmarkCard";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { FrontendBookmark, fetchBookmarks, searchBookmarks, deleteBookmark } from "@/lib/api";

interface DashboardProps {
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [bookmarks, setBookmarks] = useState<FrontendBookmark[]>([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState<FrontendBookmark[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<FrontendBookmark | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");

    // Load bookmarks on component mount
    const loadBookmarks = async () => {
        try {
            setIsLoading(true);
            setError("");
            const data = await fetchBookmarks();
            setBookmarks(data);
            setFilteredBookmarks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBookmarks();
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim() === "") {
                setFilteredBookmarks(bookmarks);
            } else {
                try {
                    setIsSearching(true);
                    setError("");
                    const searchResults = await searchBookmarks(searchQuery);
                    setFilteredBookmarks(searchResults);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Search failed');
                    // Fallback to local search if API search fails
                    const filtered = bookmarks.filter(
                        (bookmark) =>
                            bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setFilteredBookmarks(filtered);
                } finally {
                    setIsSearching(false);
                }
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery, bookmarks]);

    const handleSaveBookmark = () => {
        loadBookmarks(); // Refresh bookmarks after adding/editing
        setEditingBookmark(null);
    };

    const handleEditBookmark = (bookmark: FrontendBookmark) => {
        setEditingBookmark(bookmark);
        setIsAddModalOpen(true);
    };

    const handleDeleteBookmark = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) {
            return;
        }

        try {
            await deleteBookmark(id);
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
            setFilteredBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete bookmark');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <BookmarkIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">BookmarkAI</h1>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={onLogout}
                            className="flex items-center space-x-2"
                        >
                            <LogOutIcon className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Add Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                            <Input
                                type="text"
                                placeholder="Ask me anything... e.g., 'show me articles about machine learning in Python'"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base"
                                disabled={isSearching}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setEditingBookmark(null);
                                setIsAddModalOpen(true);
                            }}
                            className="h-12 px-6 flex items-center space-x-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Add Bookmark</span>
                        </Button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {searchQuery && (
                        <p className="text-sm text-gray-600">
                            {isSearching ? 'Searching...' : `Found ${filteredBookmarks.length} result${filteredBookmarks.length !== 1 ? "s" : ""} for "${searchQuery}"`}
                        </p>
                    )}
                </div>

                {/* Bookmarks Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-lg border border-slate-200 p-6">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredBookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                onEdit={handleEditBookmark}
                                onDelete={handleDeleteBookmark}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? "No bookmarks found" : "No bookmarks yet"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery
                                ? "Try a different search query or add some bookmarks first."
                                : "Start building your collection by adding your first bookmark."}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => {
                                setEditingBookmark(null);
                                setIsAddModalOpen(true);
                            }}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Your First Bookmark
                            </Button>
                        )}
                    </div>
                )}
            </main>

            {/* Add/Edit Bookmark Modal */}
            <AddBookmarkModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingBookmark(null);
                }}
                onSave={handleSaveBookmark}
                editBookmark={editingBookmark}
            />
        </div>
    );
};