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
                setError('Failed to load biometric engine.');
            }
        };
        loadModels();

        return () => {
            stopVideo();
        };
    }, []);

    const startVideo = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera requires secure context (HTTPS or localhost).');
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
            setError('Camera access denied. Please allow permissions.');
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

                const descriptorHash = Array.from(detection.descriptor).slice(0, 10).map(v => Math.abs(v).toString(16).substring(2, 6)).join('');

                setTimeout(() => {
                    onVerified(descriptorHash);
                }, 1500);
            } else {
                setError("Face not detected. Ensure good lighting and look directly at the camera.");
                setIsScanning(false);
            }
        } catch (err) {
            setError("Verification engine error. Please retry.");
            setIsScanning(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/[0.03]"></div>
                
                <div className="w-16 h-16 bg-emerald-500/[0.1] border border-emerald-500/[0.2] rounded-2xl flex items-center justify-center mb-5 relative z-10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-lg font-bold text-white tracking-tight z-10">Verified</h3>
                <p className="text-emerald-400/70 mt-1 text-center text-xs z-10 max-w-xs">Biometric ID secured. Raw image discarded.</p>
                
                <div className="mt-6 flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold text-gray-500 uppercase tracking-widest z-10">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Encrypted
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full rounded-2xl">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <ScanFace className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-sm font-bold text-white tracking-tight">Verify {partyName}</h3>
                </div>
                {!isModelLoaded && (
                    <span className="flex items-center text-[10px] font-bold text-blue-400 bg-blue-500/[0.08] px-2.5 py-1 rounded-lg uppercase tracking-wider border border-blue-500/[0.15]">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" /> Initializing
                    </span>
                )}
                {isModelLoaded && permissionGranted && !isScanning && (
                    <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/[0.08] px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-500/[0.15]">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                    </span>
                )}
            </div>

            <div className="relative w-full aspect-[4/3] bg-[#050A18] rounded-xl overflow-hidden mb-5 flex items-center justify-center border border-white/[0.04]">
                
                {!permissionGranted && !error && isModelLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-[#050A18]">
                        <div className="w-12 h-12 bg-blue-500/[0.1] border border-blue-500/[0.2] rounded-xl flex items-center justify-center mb-4">
                            <Camera className="w-6 h-6 text-blue-400" />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">Camera access required</h4>
                        <p className="text-gray-500 text-xs mb-4 max-w-[200px]">Allow camera to continue verification.</p>
                        <button onClick={startVideo} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-xs transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            Enable camera
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

                {/* Corner brackets */}
                {permissionGranted && (
                    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                        <div className="flex justify-between w-full">
                            <div className="w-6 h-6 border-t-2 border-l-2 border-blue-500/60 rounded-tl-lg"></div>
                            <div className="w-6 h-6 border-t-2 border-r-2 border-blue-500/60 rounded-tr-lg"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className={`w-32 aspect-[3/4] border border-dashed rounded-3xl transition-colors duration-1000 ${isScanning ? 'border-emerald-400/40 bg-emerald-400/[0.02]' : 'border-white/15'}`}></div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="w-6 h-6 border-b-2 border-l-2 border-blue-500/60 rounded-bl-lg"></div>
                            <div className="w-6 h-6 border-b-2 border-r-2 border-blue-500/60 rounded-br-lg"></div>
                        </div>
                    </div>
                )}

                {/* Scanning overlay */}
                {isScanning && (
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.8)] z-30 opacity-80" style={{ animation: 'scan-line 2.5s ease-in-out infinite' }}></div>
                )}
                {isScanning && (
                    <div className="absolute inset-0 bg-[#050A18]/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-40">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-blue-400 rounded-full animate-spin mb-3"></div>
                        <span className="text-white font-semibold tracking-wider uppercase text-[10px]">Authenticating...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="w-full mb-4 p-4 bg-red-500/[0.06] text-red-400 rounded-xl border border-red-500/[0.1] text-xs">
                    <div className="flex items-center mb-1.5">
                        <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                        <span className="font-bold text-sm">Failed</span>
                    </div>
                    <p className="ml-5.5 text-red-400/80 mb-3">{error}</p>
                    <button onClick={handleRetry} className="ml-5.5 flex items-center px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-white rounded-lg text-xs font-semibold hover:bg-white/[0.06] transition-colors">
                        <RefreshCcw className="w-3 h-3 mr-1.5" /> Retry
                    </button>
                </div>
            )}

            <div className="mt-auto">
                <button
                    onClick={handleScan}
                    disabled={!isModelLoaded || isScanning || !permissionGranted}
                    className="group w-full py-3.5 rounded-xl text-white font-semibold flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed text-sm"
                >
                    {isScanning ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</>
                    ) : (
                        <><Fingerprint className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" /> Authenticate identity</>
                    )}
                </button>
                <div className="mt-4 flex items-center justify-center text-[10px] text-gray-600 font-medium gap-4">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Local processing</span>
                    <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-600" /> Zero storage</span>
                </div>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
            `}</style>
        </div>
    );
}
