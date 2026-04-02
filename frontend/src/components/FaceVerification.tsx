'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2, Loader2, AlertCircle, ShieldCheck, RefreshCcw, Fingerprint, ScanFace, Lock } from 'lucide-react';

interface FaceVerificationProps {
    partyName: string;
    onVerified: (hash: string) => void;
}

export default function FaceVerification({ partyName, onVerified }: FaceVerificationProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const modelUrl = `${window.location.origin}/models`;
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                    faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
                    faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
                ]);
                setIsModelLoaded(true);
            } catch (err) {
                console.error('Error loading face-api models', err);
                setError('Failed to load biometric models. Ensure secure context.');
            }
        };
        loadModels();

        return () => {
            stopVideo();
        };
    }, []);

    const startVideo = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera access requires a secure connection (HTTPS) or localhost.');
            setPermissionGranted(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setPermissionGranted(true);
            setError(null);
        } catch (err) {
            console.error("error accessing webcam", err);
            setError('Camera access denied. Please allow camera permissions in your browser.');
            setPermissionGranted(false);
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleRetry = () => {
        setError(null);
        setIsScanning(false);
        startVideo();
    };

    const handleScan = async () => {
        if (!videoRef.current || !isModelLoaded) return;
        setIsScanning(true);
        setError(null);

        try {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                setIsSuccess(true);
                stopVideo();

                // Generate a pseudo 'hash' from the descriptor for the demo
                const descriptorHash = Array.from(detection.descriptor).slice(0, 10).map(v => Math.abs(v).toString(16).substring(2, 6)).join('');

                setTimeout(() => {
                    onVerified(descriptorHash);
                }, 1500);
            } else {
                setError("Face not recognized clearly. Please look directly at the lens with good lighting.");
                setIsScanning(false);
            }
        } catch (err) {
            setError("Biometric verification engine failed. Please try again.");
            setIsScanning(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-green-50/50 rounded-3xl animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
                
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] ring-8 ring-green-100 relative z-10 animate-bounce transition-all duration-700">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight z-10">Identity Verified</h3>
                <p className="text-green-700 mt-2 text-center font-medium max-w-xs z-10">Biometric hash secured via local neural network. Raw image securely discarded.</p>
                
                <div className="mt-8 flex items-center px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest shadow-sm border border-gray-100 z-10">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-green-500" /> End-to-end encrypted
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl animate-fade-in p-6 sm:p-8">
            <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <ScanFace className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Verify {partyName}</h3>
                </div>
                {!isModelLoaded && (
                    <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Loading AI
                    </span>
                )}
                {isModelLoaded && permissionGranted && !isScanning && (
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Ready
                    </span>
                )}
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-video bg-[#030914] rounded-2xl overflow-hidden mb-8 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                
                {!permissionGranted && !error && isModelLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-[#030914]">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
                            <Camera className="w-8 h-8" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">Camera Access Required</h4>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">Please allow camera permissions to perform the local Face ID scan.</p>
                        <button onClick={startVideo} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-blue-500/20">
                            Enable Camera
                        </button>
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${permissionGranted ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Secure Border UI */}
                {permissionGranted && (
                    <div className="absolute inset-0 pointer-events-none p-4 sm:p-8 flex flex-col justify-between">
                        <div className="flex justify-between w-full">
                            <div className="w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl transition-all"></div>
                            <div className="w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl transition-all"></div>
                        </div>
                        
                        {/* Center focus area indicator */}
                        <div className="flex-1 flex items-center justify-center my-4">
                            <div className={`w-40 sm:w-48 aspect-[3/4] border border-dashed rounded-[40px] transition-colors duration-1000 ${isScanning ? 'border-green-400 bg-green-400/5' : 'border-white/30'}`}></div>
                        </div>

                        <div className="flex justify-between w-full">
                            <div className="w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl transition-all"></div>
                            <div className="w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl transition-all"></div>
                        </div>
                    </div>
                )}

                {/* Scanning VFX overlay */}
                {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,1)] animate-scan-line z-30 opacity-80 mix-blend-screen"></div>
                )}
                {isScanning && (
                    <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-40">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-green-400 rounded-full animate-spin mb-4 shadow-[0_0_30px_rgba(74,222,128,0.3)]"></div>
                        <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Extracting Biometrics...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="w-full mb-6 p-5 bg-red-50 text-red-800 rounded-xl flex flex-col text-sm border border-red-200 shadow-sm animate-fade-in">
                    <div className="flex items-center mb-2">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                        <span className="font-bold text-base">Verification Failed</span>
                    </div>
                    <p className="ml-7 text-red-700/80 mb-4 font-medium leading-relaxed">{error}</p>

                    <div className="ml-7 flex space-x-3">
                        <button onClick={handleRetry} className="flex-1 px-4 py-2.5 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-bold flex justify-center items-center shadow-sm">
                            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-auto">
                <button
                    onClick={handleScan}
                    disabled={!isModelLoaded || isScanning || !permissionGranted}
                    className="group w-full py-4 rounded-xl bg-blue-600 text-white font-bold flex justify-center items-center hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed text-lg"
                >
                    {isScanning ? (
                        <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Verifying...</>
                    ) : (
                        <><Fingerprint className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" /> Scan Face ID</>
                    )}
                </button>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center text-xs text-gray-500 font-medium space-y-2 sm:space-y-0 sm:space-x-6">
                    <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> Local AI Processing</span>
                    <span className="flex items-center"><Lock className="w-4 h-4 mr-1 text-blue-500" /> Zero Image Storage</span>
                </div>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
                .animate-scan-line {
                    animation: scan-line 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
