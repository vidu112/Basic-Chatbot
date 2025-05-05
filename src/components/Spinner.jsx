// src/components/Spinner.jsx
export default function Spinner() {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* 
          w-16, h-16: size 
          border-8: thickness 
          border-blue-500: color 
          border-t-transparent: “cut out” the top so it looks like a spinner
          rounded-full: circle 
          animate-spin: built-in keyframe animation 
        */}
        <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  