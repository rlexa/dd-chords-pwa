const getMockStorage = () => {
  let storage: {[key: string]: string} = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};
Object.defineProperty(window, 'localStorage', {value: getMockStorage()});
Object.defineProperty(window, 'sessionStorage', {value: getMockStorage()});

// getComputedStyle - fake it because Angular checks in which browser it executes
Object.defineProperty(window, 'getComputedStyle', {value: () => ['-webkit-appearance']});

// deterministic now() function
Date.now = () => 1482363367071;

// deterministic random() function
Math.random = () => 0.12345;
