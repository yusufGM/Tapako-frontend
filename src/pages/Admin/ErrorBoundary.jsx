import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Error" };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
          <p className="text-sm text-slate-600">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
