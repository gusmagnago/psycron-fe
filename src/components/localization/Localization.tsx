import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StyledSelectWrapper } from './Localization.styles';
import { Select } from '@psycron/components/select/Select';

export const Localization = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const availableLanguages = [
    { name: 'EN', value: 'en' },
    { name: 'PT', value: 'pt' },
  ];

  const getDefaultLang = () => {
    const storedLang = localStorage.getItem('i18nextLng');
    return storedLang ? storedLang.toLowerCase() : lang?.toLowerCase() || 'en';
  };

  const [defaultLang, setDefaultLang] = useState<string>(getDefaultLang());

  const changeLanguage = (lng: string) => {
    const newLang = lng.toLowerCase();
    i18n.changeLanguage(newLang);
    setDefaultLang(newLang);
    localStorage.setItem('i18nextLng', newLang);

    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath);
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && i18n.language !== storedLang) {
      changeLanguage(storedLang.toLowerCase());
    } else if (lang && i18n.language !== lang) {
      changeLanguage(lang.toLowerCase());
    }
  }, [i18n, lang]);

  return (
    <StyledSelectWrapper>
      <Select
        selectLabel={defaultLang.toUpperCase()}
        value={defaultLang}
        onChangeSelect={(e) => changeLanguage(e.target.value as string)}
        items={availableLanguages}
      />
    </StyledSelectWrapper>
  );
};
