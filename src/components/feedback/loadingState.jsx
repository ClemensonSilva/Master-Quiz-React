export default function LoadingState({ 
  message = "Carregando...",
  size = "md"
}) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="text-center py-8">
      <div className={`inline-block animate-spin rounded-full ${sizes[size]} border-b-2 border-purple-600`}></div>
      <p className="text-gray-500 mt-4">{message}</p>
    </div>
  );
}