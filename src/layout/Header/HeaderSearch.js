import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeaderSearch = () => {
  const history = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();

  const searchTextHandler = (e) => {
    setSearchText(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e?.keyCode == 13) {
      history('/app/search', {
        state: { searchData: searchText },
      });
    }
  };

  return (
    <div className="eep-search-md ml-auto mx-2">
      <div className={`eep_searchbar`}>
        <input
          type="text"
          id="navsearch"
          name="navsearch"
          className={`eep_search_input`}
          placeholder={t(`dashboard.Search Users`)}
          aria-label="Search"
          aria-describedby="basic-addon2"
          autoComplete="off"
          onChange={(e) => searchTextHandler(e)}
          onKeyDown={(e) => onKeyPress(e)}
        />
        <div className={`eep_search_icon`}>
          <Link
            to={{ pathname: '/app/search' }}
            state={{ searchData: searchText }}
          >
            <img
              src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`}
              alt="Search"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
