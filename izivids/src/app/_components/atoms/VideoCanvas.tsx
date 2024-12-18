type VideoCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isBlurred: boolean;
};

const VideoCanvas = ({ canvasRef, isBlurred }: VideoCanvasProps) => (
  <canvas 
    ref={canvasRef} 
    width={640} 
    height={480} 
    className={`border border-gray-300 ${isBlurred ? 'blur-lg' : ''}`}
  />
);
 
export default VideoCanvas;