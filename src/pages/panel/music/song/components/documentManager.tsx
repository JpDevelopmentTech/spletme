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
        } else if (data && typeof data === "object") {
          docsArray = [data as Document];
        }

        setDocuments(docsArray);
      } else {
        setError(response.message || "Error loading documents");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load documents";
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
    const docId = doc._id || doc.id;
    if (!docId) return;
    try {
      const response = await documentManagerService.download(docId);
      if (!response.success || !response.blob) {
        setError(response.message || "No se pudo descargar el documento");
        return;
      }
      const blobUrl = URL.createObjectURL(response.blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = response.name || doc.name;
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

  const ALLOWED_TYPES = [
    "pdf",
    "doc",
    "docx",
    "xlsx",
    "xls",
    "jpg",
    "jpeg",
    "png",
  ];
  const MAX_SIZE_MB = 500;

  const validateFile = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_TYPES.includes(ext)) {
      return `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_TYPES.join(", ").toUpperCase()}`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `El archivo supera el límite de ${MAX_SIZE_MB} MB`;
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
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
      <div className="col-span-12 flex h-full flex-col rounded-2xl p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          {/* Header */}
          <div>
            <span className="text-title font-bold">Gestor de Documentos</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Adjuntar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table Container - Flex grow to fill available space */}
        <div className="flex flex-1 flex-col">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Loader className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Cargando documentos...</p>
              </div>
            </div>
          ) : documents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
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
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.type)}
                          <span className="text-xs text-gray-700">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="rounded bg-gray-100 p-1 text-xs text-gray-700">
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
                            className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Ver vista previa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(doc)}
                            className="rounded p-1 text-green-600 transition-colors hover:bg-green-50"
                            title="Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowDeletePopup(true);
                            }}
                            className="rounded p-1 text-red-600 transition-colors hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">
                  No hay documentos cargados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Cargar Nuevo Documento
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="rounded-lg p-1 transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-3 rounded-xl border-dashed p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                }`}
              >
                <Upload
                  className={`mx-auto mb-4 h-16 w-16 ${dragActive ? "text-blue-500" : "text-slate-400"}`}
                />
                <p className="mb-2 text-lg font-semibold text-slate-700">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="mb-4 text-sm text-slate-500">o</p>
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    disabled={uploading}
                  />
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50">
                    {uploading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      "Seleccionar Archivo"
                    )}
                  </span>
                </label>
                <p className="mt-4 text-xs text-slate-400">
                  Formatos: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG · Máx. 500
                  MB
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¿Estás seguro?
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>

              <p className="mb-6 text-slate-600">
                ¿Deseas eliminar el documento{" "}
                <span className="font-semibold">"{selectedDoc.name}"</span>?
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setSelectedDoc(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Vista Previa: {selectedDoc.name}
              </h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDoc(null);
                }}
                className="rounded-lg p-1 transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6 text-white" />
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
                    className="max-h-[560px] max-w-full rounded-lg object-contain shadow"
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <div className="rounded-full bg-white p-4 shadow">
                    {getFileIcon(selectedDoc.type)}
                  </div>
                  <p className="font-semibold text-slate-600">
                    {selectedDoc.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    Este tipo de archivo no admite vista previa
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Descargar archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
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
