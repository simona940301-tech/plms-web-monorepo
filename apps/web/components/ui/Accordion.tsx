
import React, { useState, createContext, useContext, useRef, ReactNode } from 'react';

type AccordionContextType = {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

export const Accordion: React.FC<{ children: ReactNode; defaultValue?: string }> = ({ children, defaultValue }) => {
  const [openItem, setOpenItem] = useState<string | null>(defaultValue || null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className="border-t">{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<{ children: ReactNode; value: string }> = ({ children, value }) => {
  return <div className="border-b">{children}</div>;
};

export const AccordionTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openItem, setOpenItem } = useAccordion();
  const parentValue = useContext(AccordionItemContext);
  const isOpen = openItem === parentValue;

  return (
    <button
      onClick={() => setOpenItem(isOpen ? null : parentValue)}
      className="flex items-center justify-between w-full p-4 font-medium text-left transition-all"
      aria-expanded={isOpen}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

const AccordionItemContext = createContext<string>('');

export const AccordionItemWithContext: React.FC<{ children: ReactNode; value: string }> = ({ children, value }) => {
  return (
    <AccordionItemContext.Provider value={value}>
        <div className="border-b">{children}</div>
    </AccordionItemContext.Provider>
  );
};


export const AccordionContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openItem } = useAccordion();
  const contentRef = useRef<HTMLDivElement>(null);
  const parentValue = React.useContext(AccordionItemContext);
  const isOpen = openItem === parentValue;

  return (
    <div
      ref={contentRef}
      style={{
        maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
        overflow: 'hidden',
        transition: 'max-height 0.2s ease-out',
      }}
      className="px-4 pb-4"
      hidden={!isOpen}
    >
      {children}
    </div>
  );
};
