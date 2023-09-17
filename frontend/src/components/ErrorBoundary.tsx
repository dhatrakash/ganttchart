import React, { useState, useEffect } from "react";
import Error from "./Error"; // Import your Error component

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      // Set the state to indicate that an error has occurred
      setHasError(true);
      // You can also log the error or send it to a logging service here
      console.error(error);
    };

    // Attach the error handler to the global error event
    window.addEventListener("error", errorHandler);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  // If an error has occurred, render the Error component
  if (hasError) {
    return <Error />;
  }

  // Otherwise, render the child components as usual
  return <>{children}</>;
}

export default ErrorBoundary;
