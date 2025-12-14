import { useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";

const variants = {
  success: {
    container: "bg-green-50 border-green-400 text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  error: {
    container: "bg-red-50 border-red-400 text-red-800",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-400 text-yellow-800",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  },
  info: {
    container: "bg-blue-50 border-blue-400 text-blue-800",
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
};

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  autoClose = false,
  duration = 4000,
}) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const variant = variants[type] || variants.info;

  return (
    <div
      className={`relative flex gap-3 border-l-4 p-4 rounded-2xl shadow-sm transition-all ${variant.container}`}
      role="alert"
    >
      <div className="mt-0.5">{variant.icon}</div>

      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/*
EXEMPLO DE USO:

<Alert
  type="success"
  title="Sucesso"
  message="Operação realizada com sucesso."
  onClose={() => setShow(false)}
  autoClose
/>
*/
