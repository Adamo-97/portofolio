type LoadingAnimationProps = {
  text: string;
};

export default function LoadingAnimation({ text }: LoadingAnimationProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📁</div>
        <p className="text-white/70 text-lg">{text}</p>
      </div>
    </div>
  );
}
