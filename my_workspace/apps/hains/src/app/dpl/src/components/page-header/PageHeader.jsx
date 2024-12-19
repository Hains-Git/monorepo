function PageHeader({ children, className = '' }) {
  return <div className={`page-header ${className}`}>{children}</div>;
}

export default PageHeader;
