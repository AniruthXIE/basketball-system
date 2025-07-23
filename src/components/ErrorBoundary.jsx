import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('🚨 Basketball Queue Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🏀💥</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด!</h1>
            <p className="text-gray-600 mb-6">
              ระบบจัดคิวบาสเกิดปัญหา กรุณาลองรีเฟรชหน้าเว็บ
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
              >
                🔄 รีเฟรชหน้า
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
              >
                ⚡ ลองใหม่
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  📋 ข้อมูลข้อผิดพลาด (สำหรับ Developer)
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;