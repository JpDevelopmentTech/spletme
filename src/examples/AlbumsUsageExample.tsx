/**
 * Example usage of the Albums API endpoints
 * This file demonstrates how to use the albums service and hook
 */

import React, { useState } from "react";
import useAlbums from "../hooks/useAlbums";
import AlbumService from "../services/albums";
import type { Album } from "../models/album";

export const AlbumsUsageExample: React.FC = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Using the hook (recommended approach)
  const {
    albums,
    loading,
    error,
    pagination,
    getAlbumByUPC,
    loadMoreAlbums,
    refreshAlbums,
    hasMoreAlbums,
    clearError,
  } = useAlbums(0, 5);

  // Direct service usage (alternative approach)
  const handleDirectServiceCall = async () => {
    try {
      // Get albums with pagination
      const response = await AlbumService.getAlbums(0, 10);
      if (response.success && "data" in response) {
        console.log("Albums:", response.data);
        console.log("Pagination:", response.pagination);
      }

      // Get specific album by UPC
      if (albums.length > 0) {
        const albumResponse = await AlbumService.getAlbumByUPC(albums[0].upc);
        if (albumResponse.success && "data" in albumResponse) {
          setSelectedAlbum(albumResponse.data);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Loading albums...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={clearError}>Clear</button>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Albums API Usage Example</h1>

      {/* Albums List */}
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Your Albums</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.upc} className="rounded-lg border p-4">
              <h3 className="font-bold">{album.albumTitle}</h3>
              <p className="text-gray-600">{album.artistName}</p>
              <p className="text-sm text-gray-500">UPC: {album.upc}</p>
              <div className="mt-2 text-sm">
                <p>Tracks: {album.totalTracks}</p>
                <p>Streams: {album.totalStreams.toLocaleString()}</p>
                <p>Net Income: ${album.totalNetIncome.toFixed(2)}</p>
              </div>
              <button
                onClick={() => getAlbumByUPC(album.upc)}
                className="mt-2 rounded bg-blue-500 px-3 py-1 text-sm text-white"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={refreshAlbums}
          disabled={loading}
          className="rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Refresh
        </button>

        {hasMoreAlbums && (
          <button
            onClick={loadMoreAlbums}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Load More
          </button>
        )}

        <button
          onClick={handleDirectServiceCall}
          className="rounded bg-purple-500 px-4 py-2 text-white"
        >
          Direct Service Call
        </button>
      </div>

      {/* Pagination Info */}
      {pagination && (
        <div className="mb-6 text-sm text-gray-600">
          <p>
            Showing {pagination.skip + 1} -{" "}
            {Math.min(pagination.skip + pagination.limit, pagination.total)} of {pagination.total}{" "}
            albums
          </p>
        </div>
      )}

      {/* Selected Album Details */}
      {selectedAlbum && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="mb-3 text-xl font-semibold">Album Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-bold">{selectedAlbum.albumTitle}</h3>
              <p>Artist: {selectedAlbum.artistName}</p>
              {selectedAlbum.artisticLabel && <p>Label: {selectedAlbum.artisticLabel}</p>}
              <p>UPC: {selectedAlbum.upc}</p>
            </div>
            <div>
              <p>Total Tracks: {selectedAlbum.totalTracks}</p>
              <p>Total Streams: {selectedAlbum.totalStreams.toLocaleString()}</p>
              <p>Gross Income: ${selectedAlbum.totalGrossIncome.toFixed(2)}</p>
              <p>Net Income: ${selectedAlbum.totalNetIncome.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Tracks:</h4>
            <div className="space-y-2">
              {selectedAlbum.tracks.map((track) => (
                <div key={track.isrc} className="border-l-2 border-blue-200 pl-3 text-sm">
                  <p className="font-medium">{track.trackTitle}</p>
                  <p className="text-gray-600">
                    ISRC: {track.isrc} | Streams: {track.totalStreams.toLocaleString()} | Net: $
                    {track.totalNetIncome.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedAlbum(null)}
            className="mt-4 rounded bg-gray-500 px-3 py-1 text-sm text-white"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AlbumsUsageExample;
