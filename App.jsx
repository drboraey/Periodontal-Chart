
import React, { useState, useEffect } from 'react';

const teethNumbers = [11, 12, 13, 14, 15, 16, 17, 18]; // مثال على الأسنان العلوية اليمنى
const pointsPerTooth = 6;

function App() {
  const [chartData, setChartData] = useState({});
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('متصفحك لا يدعم التعرف على الصوت');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          handleVoiceCommand(transcript);
        }
      }
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [listening]);

  const handleVoiceCommand = (command) => {
    const regex = /سن\s(\d{2})\s*نقطة\s*(\d)\s*(\d+)\s*مم/;
    const match = command.match(regex);
    if (match) {
      const tooth = match[1];
      const point = match[2];
      const value = match[3];
      const key = `${tooth}-${point}`;
      setChartData(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">مخطط اللثة</h1>
      <button
        onClick={() => setListening(!listening)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {listening ? 'إيقاف التسجيل' : 'ابدأ التسجيل الصوتي'}
      </button>

      <table className="table-auto border">
        <thead>
          <tr>
            <th>السن</th>
            {[...Array(pointsPerTooth)].map((_, i) => (
              <th key={i}>نقطة {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teethNumbers.map(tooth => (
            <tr key={tooth}>
              <td>{tooth}</td>
              {[...Array(pointsPerTooth)].map((_, i) => {
                const key = `${tooth}-${i + 1}`;
                return <td key={i}>{chartData[key] || '-'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
