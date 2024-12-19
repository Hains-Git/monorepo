import React, { useState, useEffect, ReactNode } from 'react';
import styles from './styles.module.css';

type TTabItem = {
  name: string;
  icon?: ReactNode;
};

type TProps = {
  tabs: TTabItem[];
  onSelected?: ({ name, index }: { name: string; index: number }) => void;
};

export default function TabBar({ tabs, onSelected }: TProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!tabs || tabs.length === 0) return null;

  useEffect(() => {
    const obj = {
      name: tabs[activeIndex].name,
      index: activeIndex
    };
    onSelected && onSelected(obj);
  }, [activeIndex]);

  return (
    <div className={styles.tab_bar}>
      <ul>
        {tabs.map((tab, index) => {
          return (
            <li
              key={tab.name}
              onClick={() => setActiveIndex(index)}
              className={
                index === activeIndex ? styles.active : styles.inactive
              }
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
