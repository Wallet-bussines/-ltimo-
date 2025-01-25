"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayBlock } from "@/components/Pay";

export default function Home() {
  const router = useRouter();
  const [history, setHistory] = useState<
    { date: string; description: string; amount: number; token: string }[]
  >([]);
  const [showIframe, setShowIframe] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVerification = () => {
    router.push("https://twdnrdzqthbdikjy.vercel.app/");
  };

  const handleTransaction = (transaction: {
    description: string;
    amount: number;
    token: string;
  }) => {
    const newEntry = {
      date: new Date().toLocaleString(),
      ...transaction,
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const navigateToSupport = () => {
    window.open("https://wa.me/573248092374", "_blank");
  };

  const handleVenderClick = () => {
    setShowIframe(true);
    setCurrentSection("vender");
  };

  const changeSection = (section: string) => {
    setCurrentSection(section);
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Orbital-X</h1>
        <p className="text-sm">Realiza pagos, verifica tu identidad o vende fácilmente</p>
      </header>

      <main className="flex-grow p-8 transition-all duration-500 ease-in-out">
        {currentSection === "home" && (
          <div className="w-full max-w-3xl space-y-12">
            <section className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">¿Qué deseas hacer?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleVerification}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Verificar Identidad
                </button>
                <button
                  onClick={() => changeSection("pagos")}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Realizar un Pago
                </button>
                <button
                  onClick={handleVenderClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Vender
                </button>
              </div>
            </section>

            <section className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Videos</h2>
              <div className="relative">
                <div className="slider-container overflow-x-scroll flex space-x-4">
                  {["bWnJD9-A1Rw", "GHstipo-hCM", "BzX8Yt7YhCw", "Uz8pmMyGZFU", "X1Wt0FQYvt8"].map((videoId) => (
                    <div key={videoId} className="flex-shrink-0">
                      <button
                        onClick={() => handleVideoSelect(videoId)}
                        className={`w-72 h-48 bg-gray-200 rounded-lg ${
                          selectedVideo === videoId ? "border-4 border-blue-500" : ""
                        }`}
                      >
                        {selectedVideo === videoId ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title={`Video ${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex justify-center items-center text-gray-500">
                            <span>Seleccionar Video</span>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentSection === "pagos" && (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Realiza Pagos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Envía y recibe tokens de manera segura utilizando Orbital-X.
            </p>
            <PayBlock onTransaction={handleTransaction} />
          </section>
        )}

        {currentSection === "vender" && showIframe && (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md w-full h-[calc(100vh-100px)] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Vender</h2>
            <iframe
              src="https://wallet-bussines.github.io/index8.html"
              title="Vender"
              className="w-full h-full border-0"
            />
          </section>
        )}

        {currentSection === "support" && (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Soporte</h2>
            <p>Contenido del soporte...</p>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
        <div className="flex justify-around py-2">
          <button
            onClick={() => changeSection("home")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
            </svg>
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => changeSection("pagos")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Pagos</span>
          </button>

          <button
            onClick={handleVenderClick}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Vender</span>
          </button>

          <button
            onClick={navigateToSupport}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m5-14H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
            <span className="text-xs">Soporte</span>
          </button>
        </div>
      </nav>
    </div>
  );
                          }
          
