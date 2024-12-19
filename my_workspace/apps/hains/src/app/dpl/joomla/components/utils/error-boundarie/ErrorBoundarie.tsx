import React, { ErrorInfo } from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;
    if (errorInfo) {
      return (
        <div>
          <h2>Etwas ist schief gelaufen.</h2>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '3em' }}>
            {error?.toString?.()}
            <br />
            {errorInfo?.componentStack}
          </p>
        </div>
      );
    }
    // Normally, just render children
    return children;
  }
}

export default ErrorBoundary;
