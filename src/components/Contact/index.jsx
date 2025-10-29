import "./Contact.css";
import profilePpic from "../../assets/contact-pic.png"
import cache from "../../utils/chache-ram";
import { useCurrentView } from "../ViewManager/context/currentViewContext";


export default function Contact({username, id, edit, setEdit, setSelected}) {
  let startEditTimeout;

  const { setCurrentView } = useCurrentView();
  const handleMouseDown = (e) => {
    startEditTimeout = setTimeout(() => {
      setEdit(true);
    }, 1200);
  }

  const handleMouseUp = (e) => {
    if (startEditTimeout) clearTimeout(startEditTimeout);
  }

  const handleCheck = (e) => {
    setSelected((selected) => [...selected, id]);
  }

  const handleClick = (e) => {
    cache.set(`contact-selected`, username);
    setCurrentView("contact-info")
  }
  
  
  return (
    <section className="chat-container" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onClick={handleClick}>
      <div className="chat-info">
        {edit ? <input onChange={handleCheck} type="checkbox"/> : null}
        <img className="profile-pic" src={profilePpic}></img>
        <div className="chat-text-info">
          <h4 className="chat-title text">{username}</h4>
        </div>
      </div>
    </section>
  );
}
