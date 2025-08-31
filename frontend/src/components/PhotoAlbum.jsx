import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Camera, 
  Image as ImageIcon, 
  ZoomIn, 
  Download,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { photoApi } from '../services/api';

export const PhotoAlbum = ({ userData }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [userData.email]);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await photoApi.getOwnerPhotos(userData.email);
      if (response.success) {
        setPhotos(response.data);
      } else {
        setError('Failed to load photos');
      }
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedPhoto(null);
  };

  const downloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.href = photoApi.getPhotoUrl(photo.filename);
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-lg border-0 bg-white">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading photos...</span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 shadow-lg border-0 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Camera className="h-6 w-6 mr-2 text-blue-600" />
            Property Photo Album
          </h3>
          <div className="text-sm text-slate-500">
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Camera className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h4 className="text-lg font-medium text-slate-700 mb-2">No Photos Yet</h4>
            <p className="text-slate-500 mb-4">
              Photos of your property will appear here once uploaded by our team.
            </p>
            <p className="text-sm text-slate-400">
              We'll add photos during inspections and maintenance visits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-slate-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={photoApi.getPhotoUrl(photo.filename)}
                  alt={photo.caption || photo.originalName}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200">
                    <Button
                      onClick={() => openLightbox(photo)}
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-slate-900"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => downloadPhoto(photo)}
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-slate-900"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Caption */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                    <p className="text-xs truncate">{photo.caption}</p>
                  </div>
                )}

                {/* Date */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                  {formatDate(photo.uploadedAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 bg-green-600 rounded-full">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Photo Updates</h4>
              <p className="text-sm text-green-700 mt-1">
                Our team regularly photographs your property during inspections and maintenance visits. All photos are automatically added to your album.
              </p>
              <div className="mt-3 flex space-x-4">
                <a
                  href="tel:+18503309933"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Request Photos: (850) 330-9933
                </a>
                <a
                  href="mailto:850realty@gmail.com"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={photoApi.getPhotoUrl(selectedPhoto.filename)}
              alt={selectedPhoto.caption || selectedPhoto.originalName}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close button */}
            <Button
              onClick={closeLightbox}
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Download button */}
            <Button
              onClick={() => downloadPhoto(selectedPhoto)}
              variant="secondary"
              size="sm"
              className="absolute top-4 right-16 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded-lg">
              <h4 className="font-medium">{selectedPhoto.originalName}</h4>
              {selectedPhoto.caption && (
                <p className="text-sm text-gray-300 mt-1">{selectedPhoto.caption}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Uploaded: {formatDate(selectedPhoto.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};