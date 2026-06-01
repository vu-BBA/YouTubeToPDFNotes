import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'English', name: 'English', flag: '🇺🇸' },
  { code: 'Urdu', name: 'Urdu', flag: '🇵🇰' },
  { code: 'Hindi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'Arabic', name: 'Arabic', flag: '🇸🇦' },
  { code: 'Spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'French', name: 'French', flag: '🇫🇷' },
  { code: 'German', name: 'German', flag: '🇩🇪' },
  { code: 'Chinese', name: 'Chinese', flag: '🇨🇳' },
];

const LanguageSelector = ({ selectedLanguage, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        <Globe className="inline w-4 h-4 mr-1" />
        Translate Notes To
      </label>
      
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full px-4 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 input-glow transition-all duration-200 text-gray-800 dark:text-white appearance-none cursor-pointer pr-12"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="dark:bg-slate-800">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select a language to translate the generated notes
      </p>
    </div>
  );
};

export { languages };
export default LanguageSelector;
