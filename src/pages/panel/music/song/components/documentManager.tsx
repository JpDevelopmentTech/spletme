import React, { useState, useEffect } from "react";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  X,
  FileText,
  File,
  FileImage,
  AlertCircle,
  Loader,
} from "lucide-react";
import documentManagerService from "@/services/documentManager";
import type { Document } from "@/types/documentManager.types";

interface DocumentManagerProps {
  songId: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ songId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Load documents on component mount
  useEffect(() => {
    if (songId) {
      loadDocuments();
    }
  }, [songId]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentManagerService.getBySongId(songId);
      
      if (response.success) {
        const data = response.data || [];
        let docsArray: Document[] = [];
        if (Array.isArray(data)) {
          docsArray = data;
        } else if (data && typeof data === 'object') {
          docsArray = [data as Document];
        }
        
        setDocuments(docsArray);
      } else {
        setError(response.message || "Error loading documents");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load documents";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type?.toLowerCase()) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "image":
        return <FileImage className={`${iconClass} text-blue-500`} />;
      case "xlsx":
      case "xls":
      case "excel":
        return <File className={`${iconClass} text-green-600`} />;
      case "docx":
      case "doc":
      case "word":
        return <File className={`${iconClass} text-blue-600`} />;
      case "pptx":
      case "ppt":
      case "powerpoint":
        return <File className={`${iconClass} text-orange-600`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc?._id && !selectedDoc?.id) return;
    
    const docId = (selectedDoc._id || selectedDoc.id) as string;
    const response = await documentManagerService.delete(docId);
    
    if (response.success) {
      setDocuments(documents.filter((doc) => (doc._id || doc.id) !== docId));
      setShowDeletePopup(false);
      setSelectedDoc(null);
    } else {
      setError(response.message || "Error deleting document");
    }
  };

  const handleDownload = async (doc: Document) => {
    const url = doc.url;
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("No se pudo descargar el documento");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const response = await documentManagerService.upload(songId, file);
      if (response.success) {
        await loadDocuments();
        setShowUploadModal(false);
      } else {
        setError(response.message || "Error uploading document");
      }
    } catch (err) {
      setError("Failed to upload document");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  return (
    <>
      <div className="col-span-12 p-6 rounded-2xl shadow-lg h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          {/* Header */}
          <div>
            <span className="text-title font-bold">Gestor de Documentos</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Adjuntar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Table Container - Flex grow to fill available space */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                <p className="text-gray-500 text-sm">Cargando documentos...</p>
              </div>
            </div>
          ) : documents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-2 text-left font-semibold text-gray-700">
                      Documento
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-700">
                      Tamaño
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="p-2 text-center font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc._id || doc.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.type)}
                          <span className="text-gray-700 text-xs">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="text-xs bg-gray-100 text-gray-700 p-1 rounded">
                          {doc.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-gray-600">{doc.size}</td>
                      <td className="p-2 text-xs text-gray-600">
                        {new Date(doc.uploadDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {/* Preview Button */}
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowPreview(true);
                            }}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver vista previa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowDeletePopup(true);
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 text-sm">
                  No hay documentos cargados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Cargar Nuevo Documento
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                }`}
              >
                <Upload
                  className={`w-16 h-16 mx-auto mb-4 ${dragActive ? "text-blue-500" : "text-slate-400"}`}
                />
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-sm text-slate-500 mb-4">o</p>
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                    disabled={uploading}
                  />
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50">
                    {uploading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      "Seleccionar Archivo"
                    )}
                  </span>
                </label>
                <p className="text-xs text-slate-400 mt-4">
                  Formatos soportados: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX,
                  PNG, JPG
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¿Estás seguro?
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mb-6">
                ¿Deseas eliminar el documento{" "}
                <span className="font-semibold">"{selectedDoc.name}"</span>?
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setSelectedDoc(null);
                  }}
                  className="flex-1 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Vista Previa: {selectedDoc.name}
              </h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDoc(null);
                }}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="bg-slate-50" style={{ minHeight: "500px" }}>
              {selectedDoc.type?.toLowerCase() === "pdf" ? (
                <iframe
                  src={selectedDoc.url}
                  title={selectedDoc.name}
                  className="w-full"
                  style={{ height: "600px", border: "none" }}
                />
              ) : ["png", "jpg", "jpeg", "gif", "webp", "image"].includes(
                  selectedDoc.type?.toLowerCase(),
                ) ? (
                <div className="flex items-center justify-center p-4">
                  <img
                    src={selectedDoc.url}
                    alt={selectedDoc.name}
                    className="max-w-full max-h-[560px] object-contain rounded-lg shadow"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
                  <div className="p-4 bg-white rounded-full shadow">
                    {getFileIcon(selectedDoc.type)}
                  </div>
                  <p className="text-slate-600 font-semibold">{selectedDoc.name}</p>
                  <p className="text-sm text-slate-400">
                    Este tipo de archivo no admite vista previa
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-in {
          animation:
            fade-in 0.2s ease-out,
            zoom-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default DocumentManager;
