import React, { useState } from "react";
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
} from "lucide-react";

const DocumentManager = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Contrato_Arrendamiento_2024.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "15 Ene 2024",
      url: "#",
    },
    {
      id: 2,
      name: "Factura_Enero.xlsx",
      type: "excel",
      size: "156 KB",
      uploadDate: "10 Ene 2024",
      url: "#",
    },
    {
      id: 3,
      name: "Presentacion_Proyecto.pptx",
      type: "powerpoint",
      size: "5.2 MB",
      uploadDate: "08 Ene 2024",
      url: "#",
    },
    {
      id: 4,
      name: "Imagen_Logo.png",
      type: "image",
      size: "890 KB",
      uploadDate: "05 Ene 2024",
      url: "#",
    },
    {
      id: 5,
      name: "Informe_Mensual.docx",
      type: "word",
      size: "1.1 MB",
      uploadDate: "03 Ene 2024",
      url: "#",
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "image":
        return <FileImage className="w-5 h-5 text-blue-500" />;
      case "excel":
        return <File className="w-5 h-5 text-green-600" />;
      case "word":
        return <File className="w-5 h-5 text-blue-600" />;
      case "powerpoint":
        return <File className="w-5 h-5 text-orange-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDelete = () => {
    setDocuments(documents.filter((doc) => doc.id !== selectedDoc.id));
    setShowDeletePopup(false);
    setSelectedDoc(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Aquí iría la lógica de carga del archivo
    console.log("Archivo soltado:", e.dataTransfer.files);
  };

  return (
    <>
      <div className="col-span-12 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          {/* Header */}
          <div>
            <span className="text-title font-bold">Gestor de Documentos</span>
            <p className="text-gray-600 text-sm mt-1">
              Administra y organiza todos tus archivos
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Adjuntar
          </button>
        </div>

        {/* Table Container */}
        <div className="">
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
                    key={doc.id}
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
                      {doc.uploadDate}
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
                          onClick={() => console.log("Descargar:", doc.name)}
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

          {documents.length === 0 && (
            <div className="py-8 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">
                No hay documentos cargados
              </p>
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
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
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
                    onChange={(e) =>
                      console.log("Archivo seleccionado:", e.target.files)
                    }
                  />
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors">
                    Seleccionar Archivo
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
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica de subida
                    setShowUploadModal(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-shadow"
                >
                  Subir Documento
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

            <div className="p-8 bg-slate-50 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                {getFileIcon(selectedDoc.type)}
                <p className="text-slate-600 mt-4">
                  Vista previa del documento:{" "}
                  <span className="font-semibold">{selectedDoc.name}</span>
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  (La vista previa se implementará con el sistema de
                  visualización real)
                </p>
              </div>
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
