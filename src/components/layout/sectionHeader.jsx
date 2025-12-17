import Link from 'next/link';
import SearchBar from '@/components/display/searchBar';
import Button from '@/components/ui/button';

export default function SectionHeader({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  isSearching = false,
  showSearch = false,
  showButton = false,
  buttonText = "Adicionar",
  buttonHref,
  buttonOnClick,
  buttonVariant = "dark"
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto mt-4 md:mt-0">
        {showSearch && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearching={isSearching}
            placeholder={`Pesquisar ${title.toLowerCase()}...`}
          />
        )}
        
        {showButton && (
          buttonHref ? (
            <Link href={buttonHref}>
              <Button variant={buttonVariant} className="flex items-center space-x-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{buttonText}</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant={buttonVariant}
              onClick={buttonOnClick}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>{buttonText}</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}