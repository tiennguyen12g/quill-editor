/**
 * React 19 Compatibility Polyfill
 * 
 * React 19 removed ReactDOM.findDOMNode, which react-quill still uses.
 * This polyfill provides a compatibility layer for React 19+.
 * 
 * Usage: Import this file at the top of your app entry point (before any react-quill imports)
 * 
 * import './utils/react19-polyfill';
 */

// Only apply polyfill if React 19+ is detected
if (typeof window !== 'undefined' && typeof React !== 'undefined') {
  const ReactVersion = (React as any).version;
  const majorVersion = ReactVersion ? parseInt(ReactVersion.split('.')[0], 10) : 18;

  // React 19+ removed findDOMNode
  if (majorVersion >= 19) {
    const ReactDOM = require('react-dom');
    
    // Check if findDOMNode is missing
    if (!ReactDOM.findDOMNode) {
      // Polyfill findDOMNode for React 19+
      ReactDOM.findDOMNode = function(componentOrElement: any): Element | Text | null {
        if (componentOrElement == null) {
          return null;
        }

        // If it's already a DOM element, return it
        if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
          return componentOrElement;
        }

        // If it's a React component instance, try to get the DOM node
        if (componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance) {
          // React 18+ fiber structure
          let fiber = componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance;
          
          // Traverse up to find a host component (DOM node)
          while (fiber) {
            if (fiber.stateNode && (fiber.stateNode.nodeType === 1 || fiber.stateNode.nodeType === 3)) {
              return fiber.stateNode;
            }
            fiber = fiber.return;
          }
        }

        // Fallback: try to find the first DOM node in the component
        if (componentOrElement.refs) {
          const firstRef = Object.values(componentOrElement.refs)[0];
          if (firstRef && (firstRef.nodeType === 1 || firstRef.nodeType === 3)) {
            return firstRef;
          }
        }

        return null;
      };
    }
  }
}

// Alternative: Use ref-based approach (recommended for new code)
export function createFindDOMNodePolyfill() {
  if (typeof window === 'undefined') return;

  const ReactDOM = require('react-dom');
  
  if (!ReactDOM.findDOMNode) {
    // Simple polyfill that works with refs
    ReactDOM.findDOMNode = function(componentOrElement: any): Element | Text | null {
      if (!componentOrElement) return null;
      
      // If it's a DOM element, return it
      if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
        return componentOrElement;
      }
      
      // Try to get from ref
      if (componentOrElement.current) {
        return componentOrElement.current;
      }
      
      // Try to get from stateNode (React internal)
      if (componentOrElement.stateNode) {
        return componentOrElement.stateNode;
      }
      
      return null;
    };
  }
}

