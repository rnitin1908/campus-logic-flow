
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Fingerprint, CheckCircle2, XCircle, Camera, Upload, QrCode } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BiometricVerification = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<'success' | 'failure' | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Handle fingerprint scan simulation
  const handleFingerprintScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    
    // Simulate fingerprint scanning with progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Simulate 80% success rate
          const isSuccess = Math.random() < 0.8;
          setScanResult(isSuccess ? 'success' : 'failure');
          
          toast({
            title: isSuccess ? 'Fingerprint recognized' : 'Fingerprint not recognized',
            description: isSuccess 
              ? 'The fingerprint has been successfully verified.' 
              : 'Unable to verify the fingerprint. Please try again.',
            variant: isSuccess ? 'default' : 'destructive',
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Handle camera access for face recognition
  const handleCameraToggle = async () => {
    if (showCamera) {
      // Stop the camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
    } else {
      try {
        // Start the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setShowCamera(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: 'Camera access denied',
          description: 'Unable to access your camera. Please check your permissions.',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle face recognition simulation
  const handleFaceRecognition = () => {
    if (!showCamera) {
      toast({
        title: 'Camera not active',
        description: 'Please turn on the camera first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    
    // Simulate face scanning with progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Simulate 75% success rate
          const isSuccess = Math.random() < 0.75;
          setScanResult(isSuccess ? 'success' : 'failure');
          
          toast({
            title: isSuccess ? 'Face recognized' : 'Face not recognized',
            description: isSuccess 
              ? 'The face has been successfully verified.' 
              : 'Unable to verify the face. Please try again with better lighting.',
            variant: isSuccess ? 'default' : 'destructive',
          });
          
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  // Handle QR code scanning simulation
  const handleQRCodeScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    
    // Simulate QR code scanning with progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Simulate 90% success rate
          const isSuccess = Math.random() < 0.9;
          setScanResult(isSuccess ? 'success' : 'failure');
          
          if (isSuccess) {
            toast({
              title: 'QR Code scanned successfully',
              description: 'Student ID: CS2021001, Name: John Doe, Time: 09:15 AM',
            });
          } else {
            toast({
              title: 'QR Code scan failed',
              description: 'Unable to read QR code. Please try again.',
              variant: 'destructive',
            });
          }
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Biometric Attendance</CardTitle>
          <CardDescription>
            Use biometric identification methods to record attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Fingerprint Verification */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                  Fingerprint Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-center py-4">
                  <div className={`h-32 w-32 rounded-full border-2 flex items-center justify-center ${isScanning ? 'border-primary animate-pulse' : 'border-gray-200'}`}>
                    <Fingerprint className={`h-16 w-16 ${isScanning ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                </div>
                {isScanning && (
                  <div className="mt-4">
                    <Progress value={scanProgress} className="h-2 mb-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Scanning fingerprint ({scanProgress}%)...
                    </p>
                  </div>
                )}
                {scanResult && (
                  <div className="mt-4 flex justify-center">
                    {scanResult === 'success' ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span>Failed</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleFingerprintScan} 
                  disabled={isScanning}
                >
                  {isScanning ? 'Scanning...' : 'Scan Fingerprint'}
                </Button>
              </CardFooter>
            </Card>

            {/* Face Recognition */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Face Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex flex-col items-center">
                {showCamera ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Scanning...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-md bg-gray-100 flex items-center justify-center mb-2">
                    <Camera className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                {isScanning && !showCamera && (
                  <div className="mt-4 w-full">
                    <Progress value={scanProgress} className="h-2 mb-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Processing ({scanProgress}%)...
                    </p>
                  </div>
                )}
                {scanResult && (
                  <div className="mt-2 flex justify-center">
                    {scanResult === 'success' ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span>Failed</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  className="w-full" 
                  variant={showCamera ? "default" : "outline"}
                  onClick={handleCameraToggle}
                >
                  {showCamera ? 'Turn Off Camera' : 'Turn On Camera'}
                </Button>
                {showCamera && (
                  <Button 
                    className="w-full" 
                    onClick={handleFaceRecognition}
                    disabled={isScanning}
                  >
                    Verify Face
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* QR Code Scanner */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <QrCode className="h-5 w-5 mr-2 text-primary" />
                  QR Code Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex flex-col items-center">
                <div className="w-full aspect-video rounded-md bg-gray-100 flex items-center justify-center mb-2">
                  <div className={`h-32 w-32 border-2 ${isScanning ? 'border-primary border-dashed animate-pulse' : 'border-gray-300'} rounded-md flex items-center justify-center`}>
                    <QrCode className={`h-16 w-16 ${isScanning ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                </div>
                {isScanning && (
                  <div className="mt-4 w-full">
                    <Progress value={scanProgress} className="h-2 mb-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Scanning QR code ({scanProgress}%)...
                    </p>
                  </div>
                )}
                {scanResult && (
                  <div className="mt-2 flex justify-center">
                    {scanResult === 'success' ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        <span>Scanned Successfully</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span>Scan Failed</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleQRCodeScan}
                  disabled={isScanning}
                >
                  {isScanning ? 'Scanning...' : 'Scan QR Code'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biometric Device Management</CardTitle>
          <CardDescription>
            Configure and manage connected biometric devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-4">Connected Devices</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Fingerprint className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Fingerprint Scanner XS-100</p>
                    <p className="text-sm text-muted-foreground">Serial: FP-124578 • Status: Connected</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Online</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Camera className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">HD Facial Recognition Camera</p>
                    <p className="text-sm text-muted-foreground">Serial: CAM-98765 • Status: Connected</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Online</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <QrCode className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">QR Scanner Module</p>
                    <p className="text-sm text-muted-foreground">Serial: QR-45678 • Status: Connected</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Online</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline">Add Device</Button>
              <Button variant="outline">Refresh</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricVerification;
