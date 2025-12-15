export default function IsLoading({ message }) {
    return (
        <div className="text-center py-20 text-gray-400">
            {message || 'Carregando ...'}
        </div>
    );
}
