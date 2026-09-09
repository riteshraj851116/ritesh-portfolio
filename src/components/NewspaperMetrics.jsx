import "./NewspaperMetrics.css";

const metrics = [
  {
    sub: "PRODUCTION FULL-STACK",
    title: "APPS",
    number: "03",
  },
  {
    sub: "SCALABLE REST ARCHITECTURES",
    title: "APIS",
    number: "40+",
  },
  {
    sub: "SOCKET.IO BI-DIRECTIONAL",
    title: "DELAY",
    number: "<50",
  },
  {
    sub: "DATA STRUCTURES & ALGORITHMS",
    title: "SOLVED",
    number: "200+",
  },
];

const NewspaperMetrics = () => {
  return (
    <div className="newspaper-metrics-broadside">
      <div className="metrics-strip-grid">
        {metrics.map((item, index) => (
          <div key={index} className="metric-strip-item">
            <div className="metric-text-group">
              <span className="metric-sub">{item.sub}</span>
              <h3 className="metric-title">{item.title}</h3>
            </div>
            <div className="metric-number-group">
              <span className="metric-giant-number">{item.number}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewspaperMetrics;
