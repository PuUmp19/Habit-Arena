// Barra de estadística con bloques, estilo videojuego
export default function StatBar({ icono, nombre, valor, color }) {
  const bloques = 10;
  const llenos = Math.round((valor / 100) * bloques);
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{icono} {nombre}</span>
        <strong className="pixel">{valor}</strong>
      </div>
      <div className="blocks" style={{ "--c": color }} aria-label={`${nombre}: ${valor} de 100`}>
        {Array.from({ length: bloques }).map((_, i) => (
          <i key={i} className={i < llenos ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}
