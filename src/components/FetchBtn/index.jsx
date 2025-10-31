import "./FetchBtn.css"

export default function FetchBtn({onClick}) {
    return (
        <div className="btn-container">
            <button onClick={onClick} className="fetch-btn">Rrefresh</button>
        </div>
    )
}