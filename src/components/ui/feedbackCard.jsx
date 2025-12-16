import React from 'react';
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FeedbackCard({ variant = 'neutral', title, message }) {
  const styles = {
    success: { bg: 'bg-green-50', text: 'text-green-800', icon: <CheckCircle className="w-6 h-6 text-green-600"/> },
    warning: { bg: 'bg-blue-50', text: 'text-blue-800', icon: <Mail className="w-6 h-6 text-blue-600"/> },
    error:   { bg: 'bg-purple-50', text: 'text-purple-900', icon: <AlertTriangle className="w-6 h-6 text-purple-600"/> },
  };

  const currentStyle = styles[variant] || styles.warning;

  return (
    <div className={`p-8 rounded-2xl border border-gray-100 shadow-sm ${currentStyle.bg}`}>
      <div className="flex items-center gap-3 mb-4">
        {currentStyle.icon}
        <h3 className="text-lg font-bold text-gray-900">Feedback</h3>
      </div>
      <h4 className={`font-semibold mb-2 ${currentStyle.text}`}>{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
    </div>
  );
}