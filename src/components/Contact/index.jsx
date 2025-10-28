import "./Contact.css";
import profilePpic from "../../assets/loro-profile.png"

export default function Contact({username, edit}) {
  return (
    <section className="chat-container">
      <div className="chat-info">
        {edit ? <input type="checkbox"/> : null}
        <img className="profile-pic" src={profilePpic}></img>
        <div className="chat-text-info">
          <h4 className="chat-title text">{username}</h4>
        </div>
      </div>
    </section>
  );
}
