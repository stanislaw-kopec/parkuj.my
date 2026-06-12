import * as I from "../icons";

export default function PCard({ p, onClick, onDetails, selected, availability = p.available }) {
  const handleDetails = (event) => {
    event.stopPropagation();
    onDetails?.();
  };

  return (
    <div
      className="card pc"
      onClick={onClick}
      style={
        selected
          ? { borderColor: "var(--accent)", boxShadow: "0 0 0 1px var(--accent)" }
          : {}
      }
    >
      <div className="pc-top">
        <div className="pc-icon">{p.img}</div>
        <div className="pc-price">
          {p.price}
          <small> zł/h</small>
        </div>
      </div>
      <div className="pc-name">{p.name}</div>
      <div className="pc-addr">{p.address}</div>
      <div className="pc-meta">
        <span className={`pc-av ${availability < 10 ? "low" : "ok"}`}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "currentColor",
              display: "inline-block",
            }}
          />
          {availability} wolnych
        </span>
        {p.rating && (
          <span className="pc-rat">
            <I.Star /> {p.rating}
          </span>
        )}
      </div>
      {onDetails && (
        <button className="pc-details" onClick={handleDetails}>
          Szczegóły <I.Chev />
        </button>
      )}
    </div>
  );
}
