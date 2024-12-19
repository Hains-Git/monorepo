import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { MdMenu, MdClose } from 'react-icons/md';
import styles from './navigation.module.css';
import { UseDropdown } from '../../hooks/use-dropdown';
import { addClassNames } from '../../util_func/util';
import CustomButton from '../../components/utils/custom_buttons/CustomButton';
import { isArray } from '../../tools/types';

const dropdownGroups = ['Allgemeines', 'Monatsplanung', 'Verteiler', 'Daten', 'Abwesentheiten', 'Administration'];

export const links = [
  {
    path: '/',
    label: <HiHome />,
    title: 'Home',
    className: 'as-icon-button nav-btn'
  },
  {
    path: '/dienstplaner/monatsplanung',
    label: 'Monat',
    title: 'Monatsplanung',
    group: 1,
    showDienstplaner: true
  },
  {
    path: '/wochenverteiler',
    label: 'Woche',
    title: 'Wochenverteiler',
    group: 2,
    showWV: true
  },
  {
    path: '/tagesverteiler',
    label: 'Tag',
    title: 'Tagesverteiler',
    group: 2,
    showTV: true
  },
  {
    path: '/rotationsplanung',
    label: 'Rotationen',
    title: 'Rotationsplanung',
    group: 3,
    showRotationsplaner: true
  },
  {
    path: '/freigaben',
    label: 'Freigaben',
    title: 'Freigaben der Ärzte',
    group: 3,
    isDienstplaner: true
  },
  {
    path: '/antraege',
    label: 'Abwesentheitsanträge',
    title: 'Anträge auf Abwesentheit',
    group: 4,
    showDienstplaner: true
  },
  {
    path: '/abwesentheitsliste',
    label: 'Abwesentheitsliste',
    title: 'Übersicht der Abwesentheit',
    group: 4,
    showDienstplaner: true
  },
  {
    path: '/datenbank',
    label: 'Einstellungen',
    title: 'Datenbank Einstellungen',
    group: 5,
    isAdmin: true
  },
  {
    path: '/mitarbeiterinfo',
    label: 'Mitarbeiterinfo',
    title: 'Mitarbeiterinfo und Benutzerverwaltung',
    group: 3,
    isDienstplaner: true,
    isAdmin: true,
    roles: ['Benutzerverwaltung', 'Oberärzte Anästhesie HD']
  },
  {
    path: '/pdf_layout_view',
    label: 'PDF Layouts',
    title: 'Anzeigen der Layouts zu veröffentlichender PDFs',
    group: 5,
    isAdmin: true
  },
  {
    path: '/mailer',
    label: 'DB Mail',
    title: 'Verwalten der Mailvorlagen',
    group: 5,
    isAdmin: true
  },
  {
    path: '/pep',
    label: 'PEP Einsatzplan',
    title: 'Anzeigen des PEP Einsatzplans',
    group: 3,
    isDienstplaner: true
  },
  {
    path: '/vks',
    label: 'VK Übersicht',
    title: 'Übersicht über die VKs',
    group: 3,
    isDienstplaner: true
  },
  {
    path: '/dienstplaner/vorlagen',
    label: 'Vorlagen',
    title: 'Monatsplanung Vorlagen',
    group: 1,
    showDienstplaner: true
  },
  {
    path: '/dienstplaner/statistik',
    label: 'Statistik',
    title: 'Monatsplanung Statistik',
    group: 1,
    showDienstplaner: true
  },
  // {
  //   path: '/dienstplaner/screenshot',
  //   label: 'Screenshot',
  //   title: 'Monatsplanung Screenshot',
  //   group: 1,
  //   showDienstplaner: true
  // },
  {
    path: '/faq',
    label: 'FAQ',
    title: 'Frequently Asked Questions'
  }
];

const isPathAllowed = (user, link) => {
  const checks = ['showDienstplaner', 'showTV', 'showWV', 'showRotationsplaner', 'isDienstplaner', 'isAdmin'];
  const l = checks.length;
  let hasNoAllowanceConstraints = true;
  for (let i = 0; i < l; i++) {
    const key = checks[i];
    if (link[key]) {
      hasNoAllowanceConstraints = false;
      if (user[key]) return true;
    }
  }

  return isArray(link?.roles) ? !!link.roles?.find((role) => user?.roles?.includes(role)) : hasNoAllowanceConstraints;
};

export const getAllowedPaths = (user) => {
  return links.reduce((acc, link) => {
    if (isPathAllowed(user, link)) {
      acc[link.path] = link;
    }
    return acc;
  }, {});
};

function Navigation({ user }) {
  const { show, handleClick } = UseDropdown(false, true);

  const getNavLink = (link, key) => {
    return (
      <NavLink
        exact
        to={link.path}
        className={`${styles.my_nav_link} ${addClassNames(link.className || '', styles)}`}
        title={link.title}
        key={key}
        onClick={show ? handleClick : null}
      >
        {link.label}
      </NavLink>
    );
  };

  const { topLinks, groups } = links.reduce(
    (acc, link) => {
      if (isPathAllowed(user, link)) {
        const groupIndex = link?.group || 0;
        const navLink = getNavLink(link, link.path);
        if (acc.topLinks.length < 5) {
          acc.topLinks.push(navLink);
        }

        if (acc.groups[groupIndex]) {
          acc.groups[groupIndex].push(navLink);
        } else {
          acc.groups[groupIndex] = [navLink];
        }
      }

      return acc;
    },
    {
      topLinks: [],
      groups: Array.from({ length: dropdownGroups.length })
    }
  );

  return (
    <nav className={styles.my_nav}>
      <div>
        <CustomButton className="as-icon-button" clickHandler={handleClick}>
          {show ? <MdClose /> : <MdMenu />}
        </CustomButton>
        {topLinks}
      </div>
      {show && (
        <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
          {groups.map((arr, index) => {
            if (!arr) return null;
            const label = dropdownGroups[index] || dropdownGroups[0];
            return (
              <div key={`${label}-${index}`}>
                <p>{label}</p>
                {arr}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
