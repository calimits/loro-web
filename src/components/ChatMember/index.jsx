import profilePpic from "../../assets/contact-pic.png"

export default function ChatMember({username, id}) {
    const handleClick = (e) => {
        e.preventDefault();
        console.log(username, id);
    }

    return (
        <section className="chat-container" onClick={handleClick}>
          <div className="chat-info">
            <img className="profile-pic" src={profilePpic}></img>
            <div className="chat-text-info">
              <h4 className="chat-title text">{username}</h4>
            </div>
          </div>
        </section>
      );
}