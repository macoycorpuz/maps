interface InfoSpanProps {
  children: React.ReactNode;
}

const InfoSpan: React.FC<InfoSpanProps> = ({ children }) => (
  <span className="flex items-center">{children}</span>
);

export default InfoSpan;
